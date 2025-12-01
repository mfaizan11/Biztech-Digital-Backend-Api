Create uploads folder and inside it quotations folder, also check env if missing

1: Encryption: technicalVault must never be stored in plain text. Use crypto service (AES-256) in the controller/service layer before DB operations.
2: PDFs: Proposals must generate a physical PDF file stored in uploads/proposals/ upon creation.
3: Gating: The auth.middleware.js or auth.controller.js must strictly enforce the status check for login.