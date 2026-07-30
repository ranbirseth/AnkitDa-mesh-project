import RoomForm from '../../RoomForm';
import { connectDB } from '@/lib/db';
import { RoomModel } from '@/models/Room';
import { notFound } from 'next/navigation';

export default async function EditRoomPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  
  await connectDB();
  const room = await RoomModel.findById(id);

  if (!room) {
    notFound();
  }

  // Convert Mongoose document to plain JSON object
  const roomData = JSON.parse(JSON.stringify(room.toObject()));
  roomData.id = roomData._id;

  return <RoomForm initialData={roomData} roomId={id} />;
}
