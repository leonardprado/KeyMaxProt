
import { Card, CardContent, CardHeader } from '@/components/ui/card';

const Comment = ({ comment }) => {
  return (
    <Card>
      <CardHeader className="flex flex-row justify-between">
        <p className="font-semibold">{comment.author.name}</p>
        <p className="text-sm text-gray-500">{new Date(comment.createdAt).toLocaleString()}</p>
      </CardHeader>
      <CardContent>
        <p>{comment.content}</p>
      </CardContent>
    </Card>
  );
};

export default Comment;
