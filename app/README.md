# YouTube Frame Extractor

A powerful Next.js application for extracting high-quality frames from YouTube videos with user authentication and history tracking.

## Features

- **Frame Extraction**: Extract HD/UHD frames from YouTube videos at specific timestamps
- **User Authentication**: Secure authentication with Better Auth
- **History Tracking**: Track and manage your frame extraction history (signed-in users only)
- **Quality Control**: HD quality for guests, UHD quality for authenticated users
- **Responsive Design**: Clean, modern interface that works on all devices
- **Database Integration**: PostgreSQL with Drizzle ORM for data persistence

## Tech Stack

- **Next.js 15**: React framework with App Router
- **Better Auth**: Seamless and secure authentication
- **Drizzle ORM**: Type-safe database management
- **PostgreSQL**: Robust database for user data and history
- **Tailwind CSS**: Modern styling framework
- **Lucide React**: Beautiful icons
- **Sonner**: Toast notifications

## Getting Started

Follow these steps to set up the project:

### 1\. Clone the Repository

```
git clone https://github.com/JabirDev/nextjs-better-auth.git
cd nextjs-better-auth
```

### 2\. Install Dependencies

Make sure you have Node.js installed, then run:

```
bun install
```

### 3\. Configure Environment Variables

Copy the env.example file to create your .env file:

```
cp env.example .env
```

Edit the `.env` file with your project's specific configurations:

- Add your Supabase keys and URLs.
- Configure any required authentication secrets.

### 4. Setup Database

Generate your Drizzle schema and push to your database:

```bash
# Generate migration files
bun db:generate

# Push migrations to database
bun db:push
```

### 5. Start the Development Server

Run the development server:

```bash
bun dev
```

Your application will be available at [http://localhost:3000](http://localhost:3000).

## Database Schema

The application includes the following main tables:

### Users (`user`)

- Standard user authentication fields
- Supports multiple authentication providers
- Role-based access control

### Frame Extractions (`frame_extraction`)

- `id`: Unique identifier (UUID)
- `user_id`: Foreign key to user table
- `youtube_url`: Original YouTube video URL
- `video_title`: Title of the YouTube video
- `video_thumbnail`: Thumbnail URL from YouTube
- `timestamp`: Frame timestamp (mm:ss or hh:mm:ss)
- `frame_url`: URL to the extracted frame image
- `quality`: Frame quality (HD/UHD)
- `file_size_bytes`: Size of the extracted frame
- `created_at`: Extraction timestamp

## Features Overview

### Frame Extraction

- Extract frames at specific timestamps from YouTube videos
- Support for both MM:SS and HH:MM:SS timestamp formats
- Automatic quality selection based on authentication status

### History Management

- View all previous frame extractions
- Download frames directly from history
- Delete unwanted extraction records
- Responsive grid layout with thumbnails

### User Experience

- Clean, modern interface
- Mobile-responsive design
- Toast notifications for user feedback
- Loading states and error handling

## API Endpoints

The application expects backend services at:

- `http://localhost:8000/extract_frame` - UHD extraction (authenticated users)
- `http://localhost:8001/extract_frame_720p` - HD extraction (guest users)

## Contributing

Contributions are welcome! Feel free to:

- Open issues for bugs or feature requests.
- Submit pull requests to improve the project.

### License

This project is licensed under the MIT License.
