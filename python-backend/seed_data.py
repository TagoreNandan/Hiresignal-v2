import sys
from typing import List
from sqlalchemy.orm import Session
from database import SessionLocal
from models import Opportunity

OPPORTUNITIES_DATA = [
    # --- AI ---
    {
        "title": "AI Research Engineer",
        "company": "OpenAI",
        "description": "Develop and fine-tune large language models. Experience with PyTorch, Transformers, and LLM alignment techniques is required.",
        "location": "San Francisco, CA",
        "source": "LinkedIn",
        "source_url": "https://openai.com/careers/ai-research-engineer-1"
    },
    {
        "title": "Machine Learning Engineer",
        "company": "Anthropic",
        "description": "Research and implement safety-focused transformer models. Focus on python, pytorch, scaling laws, and reinforcement learning.",
        "location": "Remote",
        "source": "Wellfound",
        "source_url": "https://anthropic.com/careers/ml-engineer-2"
    },
    {
        "title": "Computer Vision Scientist",
        "company": "Tesla",
        "description": "Design deep neural networks for autonomous vehicle perception. Skills in C++, OpenCV, PyTorch, and CUDA are highly desired.",
        "location": "Palo Alto, CA",
        "source": "Indeed",
        "source_url": "https://tesla.com/careers/cv-scientist-3"
    },
    {
        "title": "AI Product Developer",
        "company": "Midjourney",
        "description": "Build frontend and backend integrations for generative art tools. Tech stack includes React, Python, and Stable Diffusion APIs.",
        "location": "Remote",
        "source": "YC Jobs",
        "source_url": "https://midjourney.com/careers/ai-product-dev-4"
    },
    {
        "title": "MLOps Infrastructure Engineer",
        "company": "Hugging Face",
        "description": "Build and scale containerized environments for ML model deployment. Proficient in Kubernetes, Docker, MLflow, and AWS.",
        "location": "New York, NY",
        "source": "LinkedIn",
        "source_url": "https://huggingface.co/careers/mlops-eng-5"
    },
    {
        "title": "NLP Engineer",
        "company": "Cohere",
        "description": "Develop large-scale semantic text representation APIs. Experience with NLP libraries, PyTorch, and JAX is essential.",
        "location": "Toronto, ON",
        "source": "Wellfound",
        "source_url": "https://cohere.com/careers/nlp-eng-6"
    },
    
    # --- Backend ---
    {
        "title": "FastAPI Backend Developer",
        "company": "FastAPI Inc",
        "description": "Develop high-performance REST APIs using FastAPI, Python, PostgreSQL, and Redis for background queuing.",
        "location": "Remote",
        "source": "YC Jobs",
        "source_url": "https://fastapi.org/jobs/backend-dev-7"
    },
    {
        "title": "Django Backend Engineer",
        "company": "Pinterest",
        "description": "Maintain and optimize high-traffic web endpoints. Heavy focus on Python, Django, Celery, and PostgreSQL optimization.",
        "location": "San Francisco, CA",
        "source": "LinkedIn",
        "source_url": "https://pinterest.com/careers/django-backend-8"
    },
    {
        "title": "Senior Go Systems Engineer",
        "company": "Uber",
        "description": "Design and support high-throughput microservices. Strong skills in Go, gRPC, Kafka, and distributed system design.",
        "location": "Seattle, WA",
        "source": "Indeed",
        "source_url": "https://uber.com/careers/go-systems-9"
    },
    {
        "title": "Java Spring Boot Engineer",
        "company": "Amazon",
        "description": "Build transactional supply-chain services. Required skills include Java, Spring Boot, DynamoDB, and AWS services.",
        "location": "Austin, TX",
        "source": "LinkedIn",
        "source_url": "https://amazon.jobs/java-spring-10"
    },
    {
        "title": "Software Engineer (Backend)",
        "company": "Slack",
        "description": "Scale backend messaging infrastructure. Focus on Python, Go, MySQL, Memcached, and performance profiling.",
        "location": "Denver, CO",
        "source": "Wellfound",
        "source_url": "https://slack.com/careers/backend-eng-11"
    },
    {
        "title": "API Integrations Engineer",
        "company": "Stripe",
        "description": "Build developer-facing payment APIs. Strong foundation in Python, Ruby, PostgreSQL, and API design principles.",
        "location": "Remote",
        "source": "YC Jobs",
        "source_url": "https://stripe.com/jobs/api-integrations-12"
    },
    
    # --- Frontend ---
    {
        "title": "React Frontend Engineer",
        "company": "Vercel",
        "description": "Build the next generation of user dashboards using React, Next.js, TypeScript, and Tailwind CSS.",
        "location": "Remote",
        "source": "LinkedIn",
        "source_url": "https://vercel.com/careers/react-frontend-13"
    },
    {
        "title": "UI Engineer",
        "company": "Figma",
        "description": "Design interactive vector editor interfaces. Must be proficient in React, WebGL, TypeScript, and CSS layouts.",
        "location": "San Francisco, CA",
        "source": "Wellfound",
        "source_url": "https://figma.com/careers/ui-engineer-14"
    },
    {
        "title": "Frontend Architect",
        "company": "Netflix",
        "description": "Optimize client performance and user flows. Proficient in React, TypeScript, GraphQL, and performance monitoring.",
        "location": "Los Gatos, CA",
        "source": "Indeed",
        "source_url": "https://netflix.com/careers/frontend-arch-15"
    },
    {
        "title": "Next.js Frontend Developer",
        "company": "Supabase",
        "description": "Create dashboard tools and open-source documentation. Required: React, Next.js, Tailwind, TypeScript.",
        "location": "Remote",
        "source": "YC Jobs",
        "source_url": "https://supabase.io/jobs/nextjs-dev-16"
    },
    {
        "title": "Vue.js Web Developer",
        "company": "GitLab",
        "description": "Contribute to building GitLab features using Vue, Nuxt, TypeScript, and CSS frameworks.",
        "location": "Remote",
        "source": "LinkedIn",
        "source_url": "https://gitlab.com/careers/vue-web-17"
    },
    {
        "title": "Frontend Developer",
        "company": "Airbnb",
        "description": "Build customer-facing booking workflows. Strong frontend skills in HTML, CSS, React, and Redux.",
        "location": "New York, NY",
        "source": "Indeed",
        "source_url": "https://airbnb.com/careers/frontend-dev-18"
    },
    
    # --- Data ---
    {
        "title": "Data Infrastructure Engineer",
        "company": "Snowflake",
        "description": "Optimize large-scale data warehousing processes. Expertise in Python, SQL, Apache Spark, and Apache Airflow.",
        "location": "San Mateo, CA",
        "source": "LinkedIn",
        "source_url": "https://snowflake.com/careers/data-infra-19"
    },
    {
        "title": "Data Analyst",
        "company": "Spotify",
        "description": "Extract user insights to improve recommendations. Strong proficiency in SQL, Python, Tableau, and Pandas.",
        "location": "Boston, MA",
        "source": "Indeed",
        "source_url": "https://spotify.com/careers/data-analyst-20"
    },
    {
        "title": "Analytics Engineer",
        "company": "dbt Labs",
        "description": "Define data schemas and build pipelines. Proficient in SQL, dbt, Snowflake, and Google BigQuery.",
        "location": "Remote",
        "source": "Wellfound",
        "source_url": "https://dbtlabs.com/careers/analytics-eng-21"
    },
    {
        "title": "Quantitative Data Analyst",
        "company": "Jane Street",
        "description": "Analyze financial data using mathematical modeling. Extensive skills in Python, SQL, Pandas, and NumPy.",
        "location": "New York, NY",
        "source": "LinkedIn",
        "source_url": "https://janestreet.com/careers/quant-analyst-22"
    },
    {
        "title": "Big Data Platforms Engineer",
        "company": "Databricks",
        "description": "Build high-throughput streaming systems. Experience with Apache Spark, Scala, Python, and Delta Lake.",
        "location": "San Francisco, CA",
        "source": "YC Jobs",
        "source_url": "https://databricks.com/careers/big-data-23"
    },
    {
        "title": "Senior Data Scientist",
        "company": "Netflix",
        "description": "Design and analyze A/B testing methodologies for streaming features. Required: Python, SQL, statistics, and machine learning.",
        "location": "Los Gatos, CA",
        "source": "LinkedIn",
        "source_url": "https://netflix.com/careers/senior-data-sci-24"
    },
    
    # --- Cloud ---
    {
        "title": "Cloud Systems Architect",
        "company": "AWS",
        "description": "Design cloud architectures for enterprises. Heavy focus on AWS services, Terraform, IAM, and ECS.",
        "location": "Seattle, WA",
        "source": "LinkedIn",
        "source_url": "https://aws.amazon.com/careers/cloud-arch-25"
    },
    {
        "title": "DevOps Engineer",
        "company": "HashiCorp",
        "description": "Configure infrastructure provisioning platforms. Expertise in Terraform, Consul, Vault, and Kubernetes.",
        "location": "Remote",
        "source": "Wellfound",
        "source_url": "https://hashicorp.com/careers/devops-eng-26"
    },
    {
        "title": "Site Reliability Engineer",
        "company": "Google",
        "description": "Ensure high availability for global cloud infrastructure. Proficient in Go, Kubernetes, GCP, and Linux internals.",
        "location": "Mountain View, CA",
        "source": "Indeed",
        "source_url": "https://google.com/careers/sre-eng-27"
    },
    {
        "title": "Platform Infrastructure Engineer",
        "company": "GitHub",
        "description": "Build CI/CD infrastructure pipelines. Key skills include Kubernetes, Terraform, AWS, and Bash scripting.",
        "location": "Remote",
        "source": "YC Jobs",
        "source_url": "https://github.com/careers/platform-eng-28"
    },
    {
        "title": "Cloud Security Engineer",
        "company": "Cloudflare",
        "description": "Secure globally distributed edge networks. Requires Terraform, network firewalls, DNS, and IAM policy enforcement.",
        "location": "Austin, TX",
        "source": "LinkedIn",
        "source_url": "https://cloudflare.com/careers/cloud-security-29"
    },
    {
        "title": "Cloud Infrastructure Engineer",
        "company": "Scale AI",
        "description": "Provide resilient platform hosting for LLM data workflows. Expert in AWS, Kubernetes, Terraform, and ECS.",
        "location": "San Francisco, CA",
        "source": "YC Jobs",
        "source_url": "https://scale.com/careers/infra-eng-30"
    }
]


def seed_opportunities(db: Session) -> List[Opportunity]:
    """
    Seeds 30 realistic opportunities across mixed domains into the database.
    Checks existing entries by source_url to prevent duplicate seeding.
    
    Args:
        db: The SQLAlchemy Session database transaction wrapper.
        
    Returns:
        A list of Opportunity model instances that were seeded.
    """
    existing_urls = {
        url for (url,) in db.query(Opportunity.source_url).all()
    }
    
    seeded_records: List[Opportunity] = []
    
    for item in OPPORTUNITIES_DATA:
        if item["source_url"] in existing_urls:
            continue
            
        opp = Opportunity(
            title=item["title"],
            company=item["company"],
            description=item["description"],
            location=item["location"],
            source=item["source"],
            source_url=item["source_url"]
        )
        db.add(opp)
        seeded_records.append(opp)
        
    if seeded_records:
        db.commit()
        for rec in seeded_records:
            db.refresh(rec)
            
    return seeded_records


if __name__ == "__main__":
    print("Starting database seeding process...")
    db_session = SessionLocal()
    try:
        records = seed_opportunities(db_session)
        print(f"Successfully seeded {len(records)} new opportunities into the database!")
        if len(records) < len(OPPORTUNITIES_DATA):
            skipped = len(OPPORTUNITIES_DATA) - len(records)
            print(f"Skipped {skipped} duplicate opportunities (already existing in DB).")
    except Exception as e:
        print(f"Error during seeding: {e}", file=sys.stderr)
        db_session.rollback()
        sys.exit(1)
    finally:
        db_session.close()
    print("Database seeding completed.")
