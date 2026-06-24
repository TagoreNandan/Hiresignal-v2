import subprocess
import time
import sys
import os
import httpx
import uuid

# Base URL for the local FastAPI server
BASE_URL = "http://127.0.0.1:8000"

def wait_for_server(url, timeout=10):
    """Wait for the FastAPI server to become responsive."""
    start_time = time.time()
    while time.time() - start_time < timeout:
        try:
            response = httpx.get(f"{url}/docs")
            if response.status_code == 200:
                print("[+] FastAPI server is up and running!")
                return True
        except httpx.RequestError:
            pass
        time.sleep(0.5)
    return False

def run_verification():
    # Generate a unique email to prevent registration conflicts
    unique_email = f"ats.tester.{uuid.uuid4().hex[:8]}@example.com"
    test_profile = {
        "name": "ATS Candidate",
        "email": unique_email,
        "skills": ["React", "TypeScript", "Node.js"],
        "target_roles": ["Frontend Engineer", "Fullstack Developer"],
        "year_of_study": "Master's / Graduate",
        "location_pref": "Remote"
    }

    print("\n--- Starting ATS API Verification Audit ---\n")

    client = httpx.Client()

    # Step 1: Create a profile (POST /profile)
    print("[1] Creating user profile...")
    create_response = client.post(f"{BASE_URL}/profile", json=test_profile)
    assert create_response.status_code == 200, f"Failed to create profile: {create_response.text}"
    user_data = create_response.json()
    user_id = user_data["id"]
    print(f"    -> Profile created. user_id = {user_id}")
    assert user_data["name"] == test_profile["name"]
    assert user_data["email"] == test_profile["email"]

    # Step 2: Fetch profile (GET /profile/{user_id})
    print("[2] Fetching user profile...")
    get_profile_response = client.get(f"{BASE_URL}/profile/{user_id}")
    assert get_profile_response.status_code == 200, f"Failed to fetch profile: {get_profile_response.text}"
    profile_data = get_profile_response.json()
    print(f"    -> Profile fetched successfully. User email: {profile_data['email']}")
    assert profile_data["id"] == user_id

    # Step 3: Fetch opportunities (GET /opportunities)
    print("[3] Fetching opportunities...")
    opps_response = client.get(f"{BASE_URL}/opportunities")
    assert opps_response.status_code == 200, f"Failed to fetch opportunities: {opps_response.text}"
    opportunities = opps_response.json()
    print(f"    -> Total opportunities in system: {len(opportunities)}")
    assert len(opportunities) > 0, "No opportunities found in the system."
    target_opp = opportunities[0]
    opp_id = target_opp["id"]

    # Step 4: Fetch auto-seeded applications for new user
    print("[4] Retrieving auto-seeded applications...")
    apps_response = client.get(f"{BASE_URL}/applications/{user_id}")
    assert apps_response.status_code == 200, f"Failed to get applications: {apps_response.text}"
    applications = apps_response.json()
    print(f"    -> Auto-seeded application count: {len(applications)}")
    # Should have seeded 10 default tracking items on create profile
    assert len(applications) == 10, f"Expected 10 auto-populated application items, found {len(applications)}."

    # Step 5: Submit a new application manually (POST /applications)
    # Pick a non-seeded opportunity to avoid duplicate checks
    seeded_opp_ids = {item["opportunity_id"] for item in applications}
    non_seeded_opp = next((o for o in opportunities if o["id"] not in seeded_opp_ids), None)
    assert non_seeded_opp is not None, "Could not find a non-seeded opportunity to submit application to."
    new_opp_id = non_seeded_opp["id"]

    print(f"[5] Submitting new application to opportunity_id={new_opp_id}...")
    new_app_payload = {
        "user_id": user_id,
        "opportunity_id": new_opp_id,
        "status": "APPLIED",
        "notes": "Testing manual ATS submissions."
    }
    submit_response = client.post(f"{BASE_URL}/applications", json=new_app_payload)
    assert submit_response.status_code == 200, f"Failed to submit application: {submit_response.text}"
    new_app = submit_response.json()
    app_id = new_app["id"]
    print(f"    -> Application created. application_id = {app_id}")
    assert new_app["opportunity_id"] == new_opp_id
    assert new_app["status"] == "APPLIED"

    # Step 6: Transition application status (PUT /applications/{application_id}/status)
    print(f"[6] Updating application_id={app_id} stage to 'INTERVIEWING'...")
    status_payload = {"status": "INTERVIEWING"}
    status_response = client.put(f"{BASE_URL}/applications/{app_id}/status", json=status_payload)
    assert status_response.status_code == 200, f"Failed to update status: {status_response.text}"
    updated_app_status = status_response.json()
    assert updated_app_status["status"] == "INTERVIEWING"
    print(f"    -> Status updated successfully to: {updated_app_status['status']}")

    # Step 7: Update application notes (PUT /applications/{application_id}/notes)
    print(f"[7] Adding interview notes log to application_id={app_id}...")
    notes_payload = {"notes": "Scheduled dynamic interview session for Monday."}
    notes_response = client.put(f"{BASE_URL}/applications/{app_id}/notes", json=notes_payload)
    assert notes_response.status_code == 200, f"Failed to update notes: {notes_response.text}"
    updated_app_notes = notes_response.json()
    assert updated_app_notes["notes"] == notes_payload["notes"]
    print(f"    -> Notes saved successfully: {updated_app_notes['notes']}")

    # Step 8: Verify persistence of updates
    print("[8] Verifying updates are fully persisted in the database...")
    refetch_apps_response = client.get(f"{BASE_URL}/applications/{user_id}")
    assert refetch_apps_response.status_code == 200, f"Failed to get applications: {refetch_apps_response.text}"
    updated_apps = refetch_apps_response.json()
    saved_app = next((a for a in updated_apps if a["id"] == app_id), None)
    assert saved_app is not None, f"Application {app_id} not found on database refetch."
    assert saved_app["status"] == "INTERVIEWING", "Application status did not persist!"
    assert saved_app["notes"] == notes_payload["notes"], "Application notes did not persist!"
    print("    -> Database check passed. Changes fully persisted.")

    # Step 9: Delete/withdraw application (DELETE /applications/{application_id})
    print(f"[9] Withdrawing application_id={app_id}...")
    delete_response = client.delete(f"{BASE_URL}/applications/{app_id}")
    assert delete_response.status_code == 200, f"Failed to withdraw application: {delete_response.text}"
    
    # Check that it's no longer returned in user applications
    final_apps_response = client.get(f"{BASE_URL}/applications/{user_id}")
    final_apps = final_apps_response.json()
    withdrawn_app = next((a for a in final_apps if a["id"] == app_id), None)
    assert withdrawn_app is None, "Withdrawn application is still returned in user application feed!"
    print("    -> Application withdrawn. Deleted from candidate tracking records.")

    print("\n--- ATS Audit Verification Passed Successfully ---")

def main():
    server_process = None
    try:
        # Check if port 8000 is already in use
        print("[*] Checking for existing server on port 8000...")
        try:
            r = httpx.get(f"{BASE_URL}/docs", timeout=1.0)
            if r.status_code == 200:
                print("[*] Server already running. Using existing instance.")
                run_verification()
                return
        except httpx.RequestError:
            pass

        # Start the FastAPI server using the virtual environment uvicorn
        venv_python = "./venv/bin/python"
        if not os.path.exists(venv_python):
            venv_python = "python3" # Fallback

        print("[*] Starting FastAPI server process...")
        server_process = subprocess.Popen(
            [venv_python, "-m", "uvicorn", "main:app", "--host", "127.0.0.1", "--port", "8000"],
            stdout=subprocess.PIPE,
            stderr=subprocess.PIPE,
            text=True
        )

        # Wait for the server to spin up
        if not wait_for_server(BASE_URL):
            print("[-] Error: FastAPI server failed to start within timeout.", file=sys.stderr)
            stdout, stderr = server_process.communicate(timeout=1.0)
            print(f"Server stdout:\n{stdout}", file=sys.stderr)
            print(f"Server stderr:\n{stderr}", file=sys.stderr)
            sys.exit(1)

        run_verification()

    except AssertionError as ae:
        print(f"\n[-] Assertion Failed: {ae}", file=sys.stderr)
        sys.exit(1)
    except Exception as e:
        print(f"\n[-] Verification failed with error: {e}", file=sys.stderr)
        sys.exit(1)
    finally:
        if server_process:
            print("[*] Shutting down FastAPI server process...")
            server_process.terminate()
            server_process.wait()
            print("[+] Server shut down.")

if __name__ == "__main__":
    main()
