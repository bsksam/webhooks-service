# Razorpay Webhook Service

Production-ready Next.js service for handling Razorpay webhooks with LibSQL/Turso persistence.

## Vercel Setup Checklist

When importing this project into Vercel, add the following **Environment Variables**:

1. **`RAZORPAY_WEBHOOK_SECRET`**: `VvtbKZF2M8RH@QC`
2. 2. **`TURSO_DATABASE_URL`**: `libsql://office-bsksam.aws-ap-south-1.turso.io`
   3. 3. **`TURSO_AUTH_TOKEN`**: `eyJhbGciOiJFZERTQSIsInR5cCI6IkpXVCJ9.eyJhIjoicnciLCJpYXQiOjE3NzE5Mjg0NjAsImlkIjoiZDkzYWQxMGMtZDgxOS00NmQyLWJlNGUtMWE3ZmFjYzk5MTk1IiwicmlkIjoiZGRlMmM4N2EtYTM3Ni00NGEyLThlNTktZGE4OTQ3MzI0OWQwIn0.7tzkumhjXgBJJ27OfdqFHXM49I8KFIYKRkX1QMmY9DfPCTl6ZPHjDno4Sy1O-q-GsK81BQ1kaesIvnTaI12oCQ`
     
      4. ## Endpoints
     
      5. - **Webhook URL**: `https://your-deployment.vercel.app/razorpay/webhooks`
         - - **Log Viewer**: `https://your-deployment.vercel.app/logs`
          
           - ## Local Development
          
           - ```bash
             npm install
             npm run dev
             ```
