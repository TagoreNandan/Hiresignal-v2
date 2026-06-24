export interface UserProfileCreate {
  name: string;
  email: string;
  skills: string[];
  target_roles: string[];
  year_of_study?: string;
  location_pref?: string;
}

export interface UserProfileResponse {
  id: number;
  name: string;
  email: string;
  skills: string[];
  target_roles: string[];
  year_of_study: string | null;
  location_pref: string | null;
  created_at: string;
}

export interface JobApplicationOpportunity {
  id: number;
  title: string;
  company: string;
  description: string | null;
  location: string | null;
  source: string | null;
}

export interface JobApplicationResponse {
  id: number;
  user_id: number;
  opportunity_id: number;
  status: 'APPLIED' | 'INTERVIEWING' | 'OFFER' | 'REJECTED';
  notes: string | null;
  applied_at: string;
  opportunity: JobApplicationOpportunity;
}

// Centralized API Base URL config
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

/**
 * Handles HTTP response and throws rich errors.
 */
async function handleResponse<T>(response: Response): Promise<T> {
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    const message = errorData.detail || `HTTP error! status: ${response.status}`;
    throw new Error(message);
  }
  return response.json() as Promise<T>;
}

/**
 * Creates a new user profile in the database.
 */
export async function createProfile(profile: UserProfileCreate): Promise<UserProfileResponse> {
  const response = await fetch(`${API_BASE_URL}/profile`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(profile),
  });
  return handleResponse<UserProfileResponse>(response);
}

/**
 * Updates an existing user profile in the database.
 */
export async function updateProfile(userId: number, profile: UserProfileCreate): Promise<UserProfileResponse> {
  const response = await fetch(`${API_BASE_URL}/profile/${userId}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(profile),
  });
  return handleResponse<UserProfileResponse>(response);
}

/**
 * Retrieves a user profile by ID.
 */
export async function getProfile(userId: number): Promise<UserProfileResponse> {
  const response = await fetch(`${API_BASE_URL}/profile/${userId}`);
  return handleResponse<UserProfileResponse>(response);
}

/**
 * Fetches the opportunity applications for a user.
 */
export async function getApplications(userId: number): Promise<JobApplicationResponse[]> {
  const response = await fetch(`${API_BASE_URL}/applications/${userId}`);
  return handleResponse<JobApplicationResponse[]>(response);
}

/**
 * Submits a new job application.
 */
export async function createApplication(
  userId: number,
  opportunityId: number,
  status: string = 'APPLIED',
  notes?: string
): Promise<JobApplicationResponse> {
  const response = await fetch(`${API_BASE_URL}/applications`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      user_id: userId,
      opportunity_id: opportunityId,
      status,
      notes,
    }),
  });
  return handleResponse<JobApplicationResponse>(response);
}

/**
 * Updates the stage of an application.
 */
export async function updateApplicationStatus(
  applicationId: number,
  status: string
): Promise<JobApplicationResponse> {
  const response = await fetch(`${API_BASE_URL}/applications/${applicationId}/status`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ status }),
  });
  return handleResponse<JobApplicationResponse>(response);
}

/**
 * Modifies applicant tracking notes.
 */
export async function updateApplicationNotes(
  applicationId: number,
  notes: string
): Promise<JobApplicationResponse> {
  const response = await fetch(`${API_BASE_URL}/applications/${applicationId}/notes`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ notes }),
  });
  return handleResponse<JobApplicationResponse>(response);
}

/**
 * Deletes/withdraws an application record.
 */
export async function deleteApplication(applicationId: number): Promise<{ message: string }> {
  const response = await fetch(`${API_BASE_URL}/applications/${applicationId}`, {
    method: 'DELETE',
  });
  return handleResponse<{ message: string }>(response);
}

export interface OpportunityResponse {
  id: number;
  title: string;
  company: string;
  description: string | null;
  location: string | null;
  source: string | null;
  source_url: string;
  posted_date: string | null;
  scraped_at: string;
  score: number;
  status: string;
}

export async function getOpportunities(): Promise<OpportunityResponse[]> {
  const response = await fetch(`${API_BASE_URL}/opportunities`);
  return handleResponse<OpportunityResponse[]>(response);
}

export async function seedOpportunities(opp?: any): Promise<any> {
  const response = await fetch(`${API_BASE_URL}/opportunities/seed`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: opp ? JSON.stringify(opp) : undefined,
  });
  return handleResponse<any>(response);
}



