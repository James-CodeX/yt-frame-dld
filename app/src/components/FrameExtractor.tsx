"use client";

import { useState } from "react";
import { useSession } from "@/lib/auth/client";
import { saveFrameExtraction } from "@/actions/user";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { extractYouTubeVideoId, getYouTubeThumbnail, getYouTubeVideoTitle } from "@/lib/youtube-utils";
import Image from "next/image";
import Link from "next/link";
import { History, Download } from "lucide-react";
import { toast } from "sonner";

interface ExtractResponse {
  message: string;
  file_url: string;
  timestamp: string;
}

export default function FrameExtractor() {
  const { data: session } = useSession();
  const [youtubeUrl, setYoutubeUrl] = useState("");
  const [timestamp, setTimestamp] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<ExtractResponse | null>(null);
  const [error, setError] = useState("");
  const [savingHistory, setSavingHistory] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setResult(null);

    const isSignedIn = !!session;
    const apiUrl = isSignedIn
      ? "http://localhost:8000/extract_frame" // UHD
      : "http://localhost:8001/extract_frame_720p"; // HD

    try {
      const response = await fetch(apiUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          youtube_url: youtubeUrl,
          timestamp: timestamp,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || "Failed to extract frame");
      }

      const data: ExtractResponse = await response.json();
      setResult(data);

      // Save to history if user is signed in
      if (session?.user?.id) {
        setSavingHistory(true);
        try {
          const videoId = extractYouTubeVideoId(youtubeUrl);
          const videoTitle = videoId ? await getYouTubeVideoTitle(videoId) : null;
          const videoThumbnail = videoId ? getYouTubeThumbnail(videoId) : null;

          const historyResult = await saveFrameExtraction({
            userId: session.user.id,
            youtubeUrl,
            videoTitle,
            videoThumbnail,
            timestamp,
            frameUrl: data.file_url,
            quality: isSignedIn ? "UHD" : "HD",
          });

          if (historyResult.success) {
            toast.success("Frame extracted and saved to history!");
          }
        } catch (historyError) {
          console.error("Failed to save to history:", historyError);
          toast.error("Frame extracted successfully but failed to save to history");
        } finally {
          setSavingHistory(false);
        }
      } else {
        toast.success("Frame extracted successfully!");
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setLoading(false);
    }
  };

  const handleDownload = () => {
    if (result) {
      const link = document.createElement("a");
      link.href = result.file_url;
      link.download = `frame_${result.timestamp.replace(":", "_")}.jpg`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white rounded-lg shadow-md">
      <div className="mb-6">
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-2xl font-bold text-gray-900">YouTube Frame Extractor</h1>
          {session && (
            <Link href="/history">
              <Button variant="outline" size="sm">
                <History className="h-4 w-4 mr-2" />
                History
              </Button>
            </Link>
          )}
        </div>
        <p className="text-gray-600">
          Extract frames from YouTube videos at specific timestamps.
          {session ? " As a signed-in user, you get UHD quality." : " Sign in for UHD quality frames."}
        </p>
      </div>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <Label htmlFor="youtube-url">YouTube URL</Label>
          <Input
            id="youtube-url"
            type="url"
            placeholder="https://www.youtube.com/watch?v=..."
            value={youtubeUrl}
            onChange={(e) => setYoutubeUrl(e.target.value)}
            required
          />
        </div>
        <div>
          <Label htmlFor="timestamp">Timestamp (mm:ss or hh:mm:ss)</Label>
          <Input
            id="timestamp"
            placeholder="00:30"
            value={timestamp}
            onChange={(e) => setTimestamp(e.target.value)}
            required
          />
        </div>
        <Button type="submit" disabled={loading || savingHistory} className="w-full">
          {loading ? "Extracting..." : savingHistory ? "Saving..." : `Extract ${session ? "UHD" : "HD"} Frame`}
        </Button>
      </form>

      {error && (
        <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-md">
          <p className="text-red-600">{error}</p>
        </div>
      )}

      {result && (
        <div className="mt-6 space-y-4">
          <div className="p-4 bg-green-50 border border-green-200 rounded-md">
            <p className="text-green-600">{result.message}</p>
          </div>
          <div className="border rounded-lg overflow-hidden">
            <Image
              src={result.file_url}
              alt="Extracted frame"
              width={640}
              height={360}
              className="w-full h-auto"
              onError={(e) => {
                // Fallback to regular img tag if Next.js Image fails
                const target = e.target as HTMLImageElement;
                const parent = target.parentElement;
                if (parent) {
                  parent.innerHTML = `<img src="${result.file_url}" alt="Extracted frame" class="w-full h-auto" />`;
                }
              }}
            />
          </div>
          <Button onClick={handleDownload} variant="outline" className="w-full">
            <Download className="h-4 w-4 mr-2" />
            Download Frame
          </Button>
        </div>
      )}
    </div>
  );
}