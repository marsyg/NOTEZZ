export async function handleError(error: any) {
	console.error(error);
	return { success: false, error: error.message || "Something went wrong" };
}
