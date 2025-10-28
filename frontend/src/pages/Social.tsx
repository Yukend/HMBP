import { useState, useEffect } from "react";
import { posts as postsStorage, auth } from "@/lib/storage";
import { Layout } from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { Video, Send, Users } from "lucide-react";

interface Post {
  id: string;
  content: string;
  video_url: string | null;
  is_public: boolean;
  created_at: string;
  user_id: string;
}

const Social = () => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [content, setContent] = useState("");
  const [videoUrl, setVideoUrl] = useState("");
  const [isPublic, setIsPublic] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    fetchPosts();
  }, []);

  const fetchPosts = () => {
    const allPosts = postsStorage.getAll();
    setPosts(allPosts);
  };

  const handleCreatePost = () => {
    if (!content && !videoUrl) {
      toast({ title: "Error", description: "Please add content or video", variant: "destructive" });
      return;
    }

    const currentUser = auth.getCurrentUser();
    if (!currentUser) return;

    try {
      postsStorage.create({
        user_id: currentUser.id,
        content,
        video_url: videoUrl || null,
        is_public: isPublic,
      });

      toast({ title: "Success", description: "Post created successfully" });
      setContent("");
      setVideoUrl("");
      fetchPosts();
    } catch (error) {
      toast({ title: "Error", description: "Failed to create post", variant: "destructive" });
    }
  };

  return (
    <Layout>
      <div className="min-h-screen bg-background p-4 md:p-8">
        <div className="max-w-4xl mx-auto space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Video className="h-6 w-6" />
                Create Post
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <Textarea
                placeholder="What's on your mind?"
                value={content}
                onChange={(e) => setContent(e.target.value)}
                className="min-h-[100px]"
              />
              <Input
                placeholder="Video URL (optional)"
                value={videoUrl}
                onChange={(e) => setVideoUrl(e.target.value)}
              />
              <div className="flex items-center gap-4">
                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={isPublic}
                    onChange={(e) => setIsPublic(e.target.checked)}
                  />
                  <span className="text-sm">Public Post</span>
                </label>
                <Button onClick={handleCreatePost} className="ml-auto">
                  <Send className="h-4 w-4 mr-2" />
                  Post
                </Button>
              </div>
            </CardContent>
          </Card>

          <div className="space-y-4">
            <h2 className="text-2xl font-bold flex items-center gap-2">
              <Users className="h-6 w-6" />
              Feed
            </h2>
            {posts.map((post) => (
              <Card key={post.id}>
                <CardContent className="pt-6">
                  <p className="text-sm text-muted-foreground mb-2">
                    {new Date(post.created_at).toLocaleString()}
                  </p>
                  {post.content && <p className="mb-4">{post.content}</p>}
                  {post.video_url && (
                    <div className="aspect-video bg-muted rounded-lg overflow-hidden">
                      <video src={post.video_url} controls className="w-full h-full" />
                    </div>
                  )}
                  <div className="mt-4 flex items-center gap-2">
                    <span className={`text-xs px-2 py-1 rounded ${post.is_public ? 'bg-green-500/10 text-green-500' : 'bg-blue-500/10 text-blue-500'}`}>
                      {post.is_public ? 'Public' : 'Private'}
                    </span>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Social;
