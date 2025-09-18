import prisma from '@/lib/prisma'
import { notFound } from 'next/navigation'
import BillboardDetails from '../components/billboard-details'

export default async function EditBillboardPage({
  params,
}: {
  params: Promise<{ billboardId: string }>
}) {
  const billboardId = (await params).billboardId

  const billboard = await prisma.billboard.findFirst({
    where: {
      id: billboardId,
    },
    include: {
      images: true,
    },
  })
  if (!billboard) return notFound()
  return (
    <div>
      <BillboardDetails initialData={billboard} />
    </div>
  )
}
