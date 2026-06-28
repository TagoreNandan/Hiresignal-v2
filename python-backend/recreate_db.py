import sys
from database import engine, Base
from models import User, Opportunity, JobApplication, Match
from seed_data import seed_opportunities
from sqlalchemy.orm import sessionmaker

def main():
    print("Dropping all existing tables...")
    try:
        from sqlalchemy import text
        with engine.connect() as conn:
            conn.execute(text("DROP TABLE IF EXISTS matches CASCADE;"))
            conn.execute(text("DROP TABLE IF EXISTS user_opportunity_matches CASCADE;"))
            conn.execute(text("DROP TABLE IF EXISTS job_applications CASCADE;"))
            conn.execute(text("DROP TABLE IF EXISTS opportunities CASCADE;"))
            conn.execute(text("DROP TABLE IF EXISTS users CASCADE;"))
            conn.commit()
        print("[+] Tables dropped successfully via SQL cascade.")
    except Exception as e:
        print(f"[-] Error dropping tables: {e}", file=sys.stderr)
        sys.exit(1)

    print("Creating all tables according to new models...")
    try:
        Base.metadata.create_all(bind=engine)
        print("[+] Tables created successfully.")
    except Exception as e:
        print(f"[-] Error creating tables: {e}", file=sys.stderr)
        sys.exit(1)

    print("Seeding opportunities...")
    Session = sessionmaker(bind=engine)
    db = Session()
    try:
        seeded = seed_opportunities(db)
        print(f"[+] Seeded {len(seeded)} opportunities!")
    except Exception as e:
        db.rollback()
        print(f"[-] Seeding failed: {e}", file=sys.stderr)
        sys.exit(1)
    finally:
        db.close()

    print("[+] DB Recreation and Seeding completed successfully!")

if __name__ == "__main__":
    main()
