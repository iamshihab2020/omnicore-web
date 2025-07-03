# OmniCore-Web: Restaurant Management System

OmniCore-Web is a comprehensive, multi-tenant restaurant management system designed to streamline restaurant operations. It provides a feature-rich platform for managing menus, orders, points of sale, and staff, all through a user-friendly interface.

## About The Project

This project is a full-stack web application built with a modern tech stack. The backend is a powerful Django application with a multi-tenant architecture, while the frontend is a responsive and interactive Next.js application. The system is designed to be scalable and customizable to meet the needs of various restaurant businesses.

## System Architecture

The backend is built with a multi-tenant architecture, allowing multiple restaurants to use the same application instance while keeping their data completely separate. This is achieved through a shared-database, separate-schema approach, where each tenant has its own dedicated schema in the PostgreSQL database.

## Tech Stack

### Backend

*   **Framework:** Django, Django Rest Framework
*   **Database:** PostgreSQL
*   **Authentication:** JWT (JSON Web Tokens)
*   **Deployment:** Gunicorn
*   **Other:** Django CORS Headers, python-dotenv, Pillow

### Frontend

*   **Framework:** Next.js, React
*   **Styling:** Tailwind CSS
*   **UI Components:** Shadcn UI, Radix UI
*   **Animations:** Framer Motion
*   **Charts:** Recharts
*   **State Management:** React Context API
*   **Other:** TypeScript, Axios, Sonner, Zod

### API Testing

*   **Tool:** Bruno

## Features

*   **Multi-tenant architecture:** Securely manage multiple restaurant instances from a single backend.
*   **Menu Management:** Create, update, and delete categories and menu items with images and descriptions.
*   **Point of Sale (POS):** A fully functional POS system for processing orders and payments with real-time updates.
*   **Order Management:** Track and manage customer orders in real-time with status updates.
*   **Staff Management:** Manage staff roles and permissions for different sections of the application.
*   **Financial Management:** Track sales, revenue, and other financial metrics with detailed charts and reports.
*   **Settings:** Customize various aspects of the application, including taxes, counters, and user profiles.
*   **User Authentication:** Secure user authentication with JWT, including token refresh and password management.
*   **API Testing:** Comprehensive API testing collection for Bruno, covering all endpoints.

## Getting Started

To get a local copy up and running, follow these simple steps.

### Prerequisites

*   Python 3.12 or higher
*   Node.js 20.15 or higher
*   PostgreSQL

### Installation

1.  **Clone the repo**
    ```sh
    git clone https://github.com/your-username/omnicore-web.git
    ```
2.  **Backend Setup**
    ```sh
    cd backend
    python -m venv venv
    source venv/bin/activate  # On Windows, use `venv\Scripts\activate`
    pip install -r requirements.txt
    # Create a .env file and add your database credentials
    # Example .env file:
    # SECRET_KEY='your-secret-key'
    # DEBUG=True
    # DB_NAME='your-db-name'
    # DB_USER='your-db-user'
    # DB_PASSWORD='your-db-password'
    # DB_HOST='localhost'
    # DB_PORT='5432'
    python manage.py migrate
    python manage.py runserver
    ```
3.  **Frontend Setup**
    ```sh
    cd frontend
    npm install
    npm run dev
    ```

## API Documentation

The API documentation is available through the Bruno collection located in the `bruno` directory. You can use Bruno to test all the available API endpoints. To get started with Bruno, download the application from their website and import the collection.

## Folder Structure

```
.omnicore-web/
├── backend/          # Django backend
│   ├── apps/         # Django apps for different modules
│   ├── omnicore_backend/ # Django project settings
│   └── ...
├── frontend/         # Next.js frontend
│   ├── src/
│   │   ├── app/      # Next.js app router
│   │   ├── components/ # Reusable React components
│   │   └── ...
│   └── ...
├── bruno/            # Bruno API testing collection
└── ...
```

## Contributing

Contributions are what make the open-source community such an amazing place to learn, inspire, and create. Any contributions you make are **greatly appreciated**.

1.  Fork the Project
2.  Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3.  Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4.  Push to the Branch (`git push origin feature/AmazingFeature`)
5.  Open a Pull Request

## License

Distributed under the MIT License. See `LICENSE` for more information.

## Contact

Your Name - [@your_twitter](https://twitter.com/your_twitter) - email@example.com

Project Link: [https://github.com/your-username/omnicore-web](https://github.com/your-username/omnicore-web)