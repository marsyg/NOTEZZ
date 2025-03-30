
//share file /folder
// async function shareItem(itemId: string, itemType: "file" | "folder", sharedWith: string, accessLevel: "view" | "edit" | "owner") {
//     return await prisma.sharedItem.create({
//       data: {
//         itemId,
//         itemType,
//         sharedWith,
//         accessLevel,
//       },
//     });
//   }

// get shared item for user
// 
// async function getSharedItems(userId: string) {
//   return await prisma.sharedItem.findMany({
    // where: { sharedWith: userId },
//   });
// }

//revoke acc
// async function removeSharedAccess(sharedItemId: string) {
//     return await prisma.sharedItem.delete({
//       where: { id: sharedItemId },
//     });
//   }