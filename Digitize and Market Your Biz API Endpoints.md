# **Digitize and Market Your Biz API Endpoints**

**Base URL:** http://localhost:3000/api/v1  
**Authentication:** Bearer Token (JWT)  
**Content-Type:** application/json

---

## **1\. Authentication (Gated Access)**

*Implements FR-P-001, FR-P-002*

### **Register User**

**POST** /auth/register

* **Description:** registers a new user. Status defaults to Pending Approval.  
* **Access:** Public

**Body:**  
 code JSON  
downloadcontent\_copy  
expand\_less  
    {  
  "fullName": "John Doe",  
  "email": "client@example.com",  
  "password": "password123",  
  "mobile": "+971500000000",  
  "companyName": "My Business LLC", // Creates Client Profile  
  "role": "Client"  
}

*    
* **Response (201):** { "message": "Registration successful. Account pending admin approval." }

### **Login**

**POST** /auth/login

* **Description:** Authenticates user. **Blocker:** Must return error if status is Pending Approval.  
* **Access:** Public  
* **Body:** { "email": "...", "password": "..." }  
* **Response (200):** { "accessToken": "...", "refreshToken": "...", "user": { ... } }  
* **Error (403):** { "message": "Your account is currently under review by an administrator." }

---

## **2\. Admin Oversight** 

*Implements FR-A-001, FR-A-003*

### **Get Pending Approvals**

**GET** /admin/users/pending

* **Description:** List all users waiting for approval.  
* **Access:** Admin  
* **Response (200):** \[ { "id": 1, "fullName": "...", "email": "...", "createdAt": "..." }, ... \]

### **Approve/Reject User**

**PATCH** /admin/users/:id/status

* **Description:** Activates an account or rejects it.  
* **Access:** Admin

**Body:**  
 code JSON  
downloadcontent\_copy  
expand\_less  
    {  
  "status": "Active" // or "Rejected"  
}

*    
* **Note:** If "Active", trigger email notification (FR-S-001).

### **Manage Service Categories**

**POST** /admin/categories

* **Description:** Create categories for the Service Request dropdown.  
* **Access:** Admin  
* **Body:** { "name": "SEO Services", "description": "Ranking improvements" }

**GET** /admin/categories

* **Description:** Get list of categories (for frontend dropdowns).  
* **Access:** Authenticated (All roles)

---

## **3\. Client Profile & Technical Vault**

*Implements FR-CL-001, NFR-SE-002*

### **Get My Profile**

**GET** /clients/me

* **Description:** Gets client info including **decrypted** vault data.  
* **Access:** Client

**Response:**  
 code JSON  
downloadcontent\_copy  
expand\_less  
    {  
  "companyName": "...",  
  "technicalVault": "User: admin / Pass: 1234 (Decrypted)"  
}

*  

### **Update Profile & Vault**

**PUT** /clients/me

* **Description:** Updates profile. Backend must **encrypt** technicalVault before saving.  
* **Access:** Client

**Body:**  
 code JSON  
downloadcontent\_copy  
expand\_less  
    {  
  "industry": "Real Estate",  
  "websiteUrl": "https://example.com",  
  "technicalVault": "Hosting: GoDaddy, User: admin, Pass: SuperSecret"  
}

---

##      **4\. Service Requests (Needs Assessment)**

*Implements FR-CL-002, FR-A-002*

### **Submit Request**

**POST** /requests

* **Description:** Client submits a new need. Status defaults to Pending Triage.  
* **Access:** Client

**Body:**  
 code JSON  
downloadcontent\_copy  
expand\_less  
    {  
  "categoryId": 1,  
  "details": "I need a complete re-brand and a new website.",  
  "priority": "High"  
}

*  

### **List Requests**

**GET** /requests

* **Description:**  
  * **Admin:** Sees all Pending Triage requests.  
  * **Agent:** Sees requests assigned to them.  
  * **Client:** Sees only their own requests.  
*   
* **Access:** Authenticated (Logic depends on role)

### **Assign Agent (Triage)**

**PATCH** /requests/:id/assign

* **Description:** Assigns an agent to a request.  
* **Access:** Admin

**Body:**  
 code JSON  
downloadcontent\_copy  
expand\_less  
    {  
  "agentId": 5  
}

* **Side Effect:** Updates status to Assigned.

## **5\. Proposals (Quotes)**

*Implements FR-AG-002, FR-CL-004*

### **Generate Proposal**

**POST** /proposals

* **Description:** Creates a proposal line-by-line. Generates PDF on server.  
* **Access:** Agent

**Body:**  
 code JSON  
downloadcontent\_copy  
expand\_less  
    {  
  "requestId": 10,  
  "items": \[  
    { "description": "Homepage Design", "price": 1500 },  
    { "description": "SEO Setup", "price": 500 }  
  \]  
}

*    
* **Side Effect:** Updates Request status to Quoted.

### **Send Proposal**

**POST** /proposals/:id/send

* **Description:** Emails the PDF to the client.  
* **Access:** Agent  
* **Response:** { "message": "Proposal sent to client@example.com" }

### **Respond to Proposal (Accept/Reject)**

**PATCH** /proposals/:id/status

* **Description:** Client accepts or rejects the quote.  
* **Access:** Client  
* **Body:** { "status": "Accepted" }  
* **CRITICAL LOGIC:** If status is Accepted, the backend must automatically create a **Project** record.

##      **6\. Project Dashboard**

*Implements FR-AG-004, FR-CL-005*

### **List Projects**

**GET** /projects

* **Description:** List active projects.  
* **Access:** Client (Own), Agent (Assigned), Admin (All).

### **Update Project Status**

**PATCH** /projects/:id

* **Description:** Update tracking metrics.  
* **Access:** Agent

**Body:**  
 code JSON  
downloadcontent\_copy  
expand\_less  
    {  
  "globalStatus": "In Progress", // Enum: Pending, In Progress, Testing, Delivered  
  "progressPercent": 45,         // Integer 0-100  
  "ecd": "2025-12-25"            // Estimated Completion Date  
}

---

## **7\. Asset Management**

*Implements FR-CL-006, FR-AG-005*

### **Upload Asset**

**POST** /projects/:id/assets

* **Description:** Upload a file.  
* **Access:** Client, Agent  
* **Body:** Form-Data (file: binary)  
* **Query Param:** ?type=Deliverable or ?type=ClientAsset

### **List Assets**

**GET** /projects/:id/assets

* **Description:** Get list of files for a project.  
* **Access:** Client, Agent  
* **Response:** \[ { "fileName": "logo.png", "path": "/uploads/...", "type": "ClientAsset" } \]

