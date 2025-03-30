import { handleError } from "@/lib/handleError";
import prisma from "@/lib/prisma";

export async function createUser(
	name: string,
	email: string,
	passwordHash: string
) {
	try {
		const result = await prisma.$transaction(async (prisma) => {
			// Create User
			const user = await prisma.user.create({
				data: {
					name,
					email,
					passwordHash,
				},
			});

			// Create RootFolder linked to User
			const rootFolder = await prisma.rootFolder.create({
				data: {
					userId: user.id,
				},
			});

			return { user, rootFolder };
		});

		return { success: true, data: result };
	} catch (error: any) {
		return {
			success: false,
			error: error.message || "Failed to create user and root folder",
		};
	}
}

export async function getUserById(userId: string) {
	try {
		const user = await prisma.user.findUnique({
			where: { id: userId },
			include: { rootFolder: true, folders: true, files: true },
		});

		if (!user) throw new Error("User not found");

		return { success: true, data: user };
	} catch (error) {
		return handleError(error);
	}
}

export async function showTrashed(userId: string) {
	try {
		const user = await prisma.user.findUnique({
			where: { id: userId },
		});

		if (!user) throw new Error("User not found");

		const folders = await prisma.folder.findMany({
			where: { userId, isTrashed: true },
		});

		const files = await prisma.file.findMany({
			where: { userId, isTrashed: true },
		});

		return { success: true, data: [files, folders] };
	} catch (error) {
		return handleError(error);
	}
}

export async function deleteTrashed(userId: string) {
	try {
		const user = await prisma.user.findUnique({
			where: { id: userId },
		});

		if (!user) throw new Error("User not found");

		const folders = await prisma.folder.deleteMany({
			where: { userId, isTrashed: true },
		});

		const files = await prisma.file.deleteMany({
			where: { userId, isTrashed: true },
		});

		return { success: true, message: "Trashed deleted permanently" };
	} catch (error) {
		return handleError(error);
	}
}
