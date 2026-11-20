import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  getHello(): string {
    return `
      <div style="font-family: Arial, sans-serif; padding: 20px; color: #333; line-height: 1.6;">
        <h1 style="color: #2C3E50;">Welcome to the backend API for <b>sawaribd.com</b>!</h1>
        <p style="margin-bottom: 20px;">
          This API serves as the backend for <b>sawaribd.com</b>, providing endpoints for managing users and bike information seamlessly.
        </p>

        <h2 style="color: #16A085;">Role-Based Access:</h2>
        <ul style="margin-left: 20px; margin-bottom: 20px;">
          <li><b>Admin:</b> Full access to create, read, update, and delete (CRUD) data across all endpoints.</li>
          <li><b>Moderator:</b> Can edit existing records (read and update access).</li>
          <li><b>User:</b> View-only access to retrieve data.</li>
        </ul>

        <h2 style="color: #16A085;">Available Endpoints:</h2>
        <ul style="margin-left: 20px; margin-bottom: 20px;">
          <li>
            <b>Authentication (auth):</b> 
            <ul>
              <li><b>Admin:</b> Manage all user roles and authentication settings.</li>
              <li><b>Moderator:</b> Cannot access authentication settings.</li>
              <li><b>User:</b> Only able to log in and access their data.</li>
            </ul>
          </li>
          <li>
            <b>Users:</b> Manage user profiles.
            <ul>
              <li><b>Admin:</b> Can create, read, update, and delete any user profile.</li>
              <li><b>Moderator:</b> Can edit user profiles but not delete them.</li>
              <li><b>User:</b> Can view their own profile only.</li>
            </ul>
          </li>
          <li>
            <b>Bike Information:</b> Manage and retrieve bike data.
            <ul>
              <li><b>Admin:</b> Full CRUD access to manage all bike data.</li>
              <li><b>Moderator:</b> Can update and edit bike records.</li>
              <li><b>User:</b> Can view available bike information.</li>
            </ul>
          </li>
          <li>
            <b>Activity Logs:</b> View user activity history.
            <ul>
              <li><b>Admin:</b> Can view all activity logs.</li>
              <li><b>Moderator:</b> Can view activity logs for users they manage.</li>
              <li><b>User:</b> Can view only their own activity logs.</li>
            </ul>
          </li>
        </ul>

        <h2 style="color: #16A085;">API Documentation:</h2>
        <p style="margin-bottom: 20px;">
          Comprehensive API documentation is available at:
         <a href="${process.env.URL}/docs" target="_blank" ">${process.env.URL}/docs</a>
        </p>

        <h2 style="color: #16A085;">Contact Information:</h2>
        <p>
          - <b>Name:</b> Sawari BD Support<br>
          - <b>Email:</b> <a href="mailto:contact@sawaribd.com" style="color: #2980B9;">contact@sawaribd.com</a><br>
          - <b>Phone:</b> <a href="tel:+8801700000000" style="color: #2980B9;">01700000000</a>
        </p>

        <footer style="margin-top: 30px; padding-top: 15px; border-top: 1px solid #ccc; font-size: 0.9em; color: #7F8C8D;">
          <p>Thank you for visiting the <b>sawaribd.com</b> backend API. Feel free to explore and use the provided endpoints as per your access role.</p>
        </footer>
      </div>
    `;
  }
}
