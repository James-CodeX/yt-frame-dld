"use client";

import { useEffect, useState } from "react";
import { useSession } from "@/lib/auth/client";
import { getUserFrameExtractions, deleteFrameExtraction } from "@/actions/user";
import { FrameExtractionType } from "@/db/schema";
import { Button } from "@/components/ui/button";
import { formatTimestamp, timeAgo } from "@/lib/youtube-utils";
import Image from "next/image";
import Link from "next/link";
import { Trash2, Download, ExternalLink, Clock, Calendar } from "lucide-react";
import { toast } from "sonner";

export default function HistoryPage() {
  const { data: session } = useSession();
  const [extractions, setExtractions] = useState<FrameExtractionType[]>([]);
  const [loading, setLoading] = useState(true);
  const [deleteLoading, setDeleteLoading] = useState<string | null>(null);

  useEffect(() => {
    if (session?.user?.id) {
      loadHistory();
    }
  }, [session]);

  const loadHistory = async () => {
    if (!session?.user?.id) return;
    
    setLoading(true);
    const result = await getUserFrameExtractions(session.user.id);
    
    if (result.success && result.data) {
      setExtractions(result.data);
    } else {
      toast.error(result.error || "Failed to load history");
    }
    setLoading(false);
  };

  const handleDelete = async (id: string) => {
    if (!session?.user?.id) return;
    
    setDeleteLoading(id);
    const result = await deleteFrameExtraction(id, session.user.id);
    
    if (result.success) {
      setExtractions(prev => prev.filter(item => item.id !== id));
      toast.success("Extraction deleted successfully");
    } else {
      toast.error(result.error || "Failed to delete extraction");
    }
    setDeleteLoading(null);
  };

  const handleDownload = (frameUrl: string, timestamp: string, videoTitle: string) => {
    const link = document.createElement("a");
    link.href = frameUrl;
    link.download = `${videoTitle.replace(/[^a-zA-Z0-9]/g, '_')}_${timestamp.replace(":", "_")}.jpg`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  if (!session) {
    return (
      <div className="max-w-4xl mx-auto p-6">
        <div className="text-center py-12">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Extraction History</h1>
          <p className="text-gray-600 mb-6">Please sign in to view your extraction history.</p>
          <Link href="/signin">
            <Button>Sign In</Button>
          </Link>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto p-6">
        <div className="text-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="text-gray-600 mt-4">Loading your history...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="mb-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Extraction History</h1>
            <p className="text-gray-600 mt-2">
              Your frame extraction history ({extractions.length} total)
            </p>
          </div>
          <Link href="/">
            <Button variant="outline">
              Extract New Frame
            </Button>
          </Link>
        </div>
      </div>

      {extractions.length === 0 ? (
        <div className="text-center py-12 bg-gray-50 rounded-lg">
          <Clock className="mx-auto h-12 w-12 text-gray-400 mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No extractions yet</h3>
          <p className="text-gray-600 mb-6">Start extracting frames from YouTube videos to see them here.</p>
          <Link href="/">
            <Button>Extract Your First Frame</Button>
          </Link>
        </div>
      ) : (
        <div className="grid gap-6">
          {extractions.map((extraction) => (
            <div key={extraction.id} className="bg-white rounded-lg shadow-md border border-gray-200 overflow-hidden">
              <div className="md:flex">
                {/* Thumbnail */}
                <div className="md:w-64 md:flex-shrink-0">
                  <div className="relative h-48 md:h-full">
                    <Image
                      src={extraction.frameUrl}
                      alt={`Frame at ${extraction.timestamp}`}
                      fill
                      className="object-cover"
                      onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        target.src = extraction.videoThumbnail || '/placeholder-frame.svg';
                      }}
                    />
                    <div className="absolute top-2 right-2 bg-black bg-opacity-75 text-white px-2 py-1 rounded text-sm">
                      {extraction.quality}
                    </div>
                  </div>
                </div>

                {/* Content */}
                <div className="p-6 flex-1">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold text-gray-900 mb-2">
                        {extraction.videoTitle || "Unknown Video"}
                      </h3>
                      
                      <div className="flex items-center text-sm text-gray-600 mb-2">
                        <Clock className="h-4 w-4 mr-1" />
                        <span>Frame at {formatTimestamp(extraction.timestamp)}</span>
                      </div>
                      
                      <div className="flex items-center text-sm text-gray-500 mb-4">
                        <Calendar className="h-4 w-4 mr-1" />
                        <span>{timeAgo(new Date(extraction.createdAt))}</span>
                      </div>

                      <div className="flex flex-wrap gap-2">
                        <Button
                          size="sm"
                          onClick={() => handleDownload(
                            extraction.frameUrl, 
                            extraction.timestamp, 
                            extraction.videoTitle || "frame"
                          )}
                        >
                          <Download className="h-4 w-4 mr-1" />
                          Download
                        </Button>
                        
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => window.open(extraction.youtubeUrl, '_blank')}
                        >
                          <ExternalLink className="h-4 w-4 mr-1" />
                          View Video
                        </Button>
                        
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => window.open(extraction.frameUrl, '_blank')}
                        >
                          <ExternalLink className="h-4 w-4 mr-1" />
                          View Frame
                        </Button>
                      </div>
                    </div>

                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => handleDelete(extraction.id)}
                      disabled={deleteLoading === extraction.id}
                      className="text-red-600 hover:text-red-700 hover:bg-red-50"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}