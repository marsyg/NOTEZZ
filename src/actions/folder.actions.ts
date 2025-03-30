import { handleError } from "@/lib/handleError";
import prisma from "@/lib/prisma";

export async function checkFolderExistsAlready(
	userId: string,
	name: string,
	parentId: string
) {
	try {
		const sameNameFolder = await prisma.folder.findFirst({
			where: {
				userId: userId,
				name: name,
				parentId: parentId,
				isTrashed: false,
			},
		});

		if (sameNameFolder) throw new Error("Folder with same name already exists");

		return { success: true, data: sameNameFolder };
	} catch (error) {
		return handleError(error);
	}
}

export async function getNameUserAndParentId(folderId: string) {
	const existingFolder = await prisma.folder.findUnique({
		where: { id: folderId },
	});

	if (!existingFolder) throw new Error("Folder not found");

	let parentId = existingFolder.parentId;

	if (!parentId) {
		const rootFolder = await prisma.rootFolder.findUnique({
			where: { userId: existingFolder.userId },
		});

		parentId = rootFolder?.id!;
	}

	return {
		name: existingFolder.name,
		userId: existingFolder.userId,
		parentId,
	};
}

export async function createFolder(
	name: string,
	userId: string,
	parentId?: string
) {
	try {
		// Get user's root folder
		const userRootFolder = await prisma.rootFolder.findUnique({
			where: { userId },
		});

		if (!userRootFolder) throw new Error("Root folder not found");

		await checkFolderExistsAlready(userId, name, parentId || userRootFolder.id);

		const folder = await prisma.folder.create({
			data: {
				name,
				userId,
				rootFolderId: userRootFolder.id,
				parentId: parentId || userRootFolder.id, // Default to root if no parent is given
			},
		});

		return { success: true, data: folder };
	} catch (error) {
		return handleError(error);
	}
}

export async function moveFolder(
	folderId: string,
	newParentId: string
) {
	try {
		const { userId, name, parentId } = await getNameUserAndParentId(folderId);

		await checkFolderExistsAlready(userId, name, parentId);


		const folder = await prisma.folder.update({
			where: { id: folderId },
			data: { parentId: newParentId },
		});

		return { success: true, data: folder };
	} catch (error) {
		return handleError(error);
	}
}

export async function restoreFolder(folderId: string) {
	try {
		const { userId, name, parentId } = await getNameUserAndParentId(folderId);

		await checkFolderExistsAlready(userId, name, parentId);

		const folder = await prisma.folder.update({
			where: { id: folderId },
			data: { isTrashed: false, trashedAt: null },
		});

		return { success: true, data: folder };
	} catch (error) {
		return handleError(error);
	}
}

export async function moveFolderToTrash(folderId: string) {
	try {
		const folder = await prisma.folder.update({
			where: { id: folderId },
			data: { isTrashed: true, trashedAt: new Date() },
		});

		return { success: true, data: folder };
	} catch (error) {
		return handleError(error);
	}
}

export async function deleteFolder(folderId: string) {
	try {
		await prisma.folder.delete({ where: { id: folderId } });

		return { success: true, message: "Folder deleted permanently" };
	} catch (error) {
		return handleError(error);
	}
}

