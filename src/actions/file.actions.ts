import { handleError } from "@/lib/handleError";
import prisma from "@/lib/prisma";

async function uploadFile(
  name: string,
  userId: string,
  folderId: string,
  mimeType: string,
  size: bigint,
  publicId: string
) {
  try {
    const ifFileWithSameNameExist = await prisma.file.findFirst({
      where: {
        name: name,
        userId: userId,
        folderId: folderId,
        isTrashed: false,
      },
    });
    if (!ifFileWithSameNameExist)
      throw new Error("File with same name already exists");

    const file = await prisma.file.create({
      data: { name, userId, folderId, mimeType, size, publicId },
    });

    return { success: true, data: file };
  } catch (error) {
    return handleError(error);
  }
}

async function moveFileToTrash(fileId: string) {
  try {
    const existingFile = await prisma.file.findUnique({
      where: {
        id: fileId,
      },
    });

    if (!existingFile) throw new Error("File doesn't exist");

    const deletedFile = await prisma.file.update({
      where: { id: fileId },
      data: { isTrashed: true, trashedAt: new Date() },
    });

    return deletedFile;
  } catch (error) {
    handleError(error);
  }
}

async function restoreFile(fileId: string) {
  try {
    const existingFile = await prisma.file.findUnique({
      where: {
        id: fileId,
      },
    });

    if (!existingFile) throw new Error("File doesn't exist");

    const restoredFile = await prisma.file.update({
      where: { id: fileId },
      data: { isTrashed: false, trashedAt: null },
    });

    return restoredFile;
  } catch (error) {
    handleError(error);
  }
}

async function deleteFile(fileId: string) {
  try {
    const existingFile = await prisma.file.findFirst({
      where: {
        id: fileId,
      },
    });

    if (!existingFile) throw new Error("File doesn't exist");
    const deletedFile = await prisma.file.delete({
      where: { id: fileId },
    });

    return deletedFile;
  } catch (error) {
    handleError(error);
  }
}

async function getAllFile(userId: string) {
  try {
    return await prisma.file.findMany({
      where: {
        userId: userId,
        isTrashed: false,
      },
    });
  } catch (error) {
    handleError(error);
  }
}

export { uploadFile, moveFileToTrash, restoreFile, deleteFile };
