// export const shouldStopListening = (user, model, changes) => {
// const { operationType, updateDescription, fullDocument } = changes;
// if (operationType === "delete") return true;
// if (user.role === "deliverer") {
//   if (!["pickup", "order"].includes(model)) return false;
//   const hasRemovedDeliverer = updateDescription.removedFields?.inlcudes("deliverer");
//   const hasSetDeliverer = !!updateDescription.updatedFields?.deliverer;
//   if (hasRemovedDeliverer) return true;
//   if (hasSetDeliverer && updateDescription.updateDescription?.deliverer._id !== user._id) {
//     return true;
//   }
// }
// if (user.role === "warehouse") {
//   if (!["pickup", "order", "transfer"].includes(model)) return false;
// }
// if(user.role === "deliverer") {
//   const removedDeliverer = updateDescription.removedFields?.includes("deliverer");
// }
// };

// export const shouldStopListening = (user, changes) => {
// const { operationType, updateDescription, fullDocument } = changes;

//   if (operationType === "delete") return true;
//   if (["client", "admin", "followup", "payman"]) return false;

//   if (user.role === "deliverer") {
//     const { options, warehouse } = user.deliverer;

//     let new_city;
//     let new_zone;
//     let new_deliverer;

//     if (operationType === "update") {
//       new_city = updateDescription.updatedFields.target?.city;
//       new_zone =
//         updateDescription.updatedFields.target?.zone ||
//           updateDescription.removedFields?.includes("target.zone")
//           ? ""
//           : undefined;
//       new_deliverer = updateDescription.updatedFields.deliverer?._id;
//     }

//     if (operationType === "replace") {
//       new_city = fullDocument.target?.city;
//       new_zone = fullDocument.target?.zone;
//       new_deliverer = fullDocument.deliverer?._id;
//     }

//     if (new_deliverer && new_deliverer !== user._id) return true;

//     if (new_city) {
//       if (options.cities.length) {
//         if (!options.cities.includes(new_city)) return true;
//       } else {
//         if (![warehouse.city, ...warehouse.alt_cities].includes(new_city)) return true;
//       }
//     }

//     if (typeof new_zone !== "undefined") {
//       if (!new_zone) return true;
//       if (!options.zones.length) return false;
//       if (!options.zones.includes(new_zone)) return true;
//     }
//   }

//   if (user.role === "warehouse") {
//     const { city, alt_cities } = user.warehouse;
//     let new_city;

//     if (operationType === "update") {
//       new_city = updateDescription.updatedFields.target?.city; // may be undefined
//     }

//     if (operationType === "replace") {
//       new_city = fullDocument.target?.city;
//     }

//     if (!new_city) return false;

//     if (![city, ...alt_cities].includes(new_city)) return true;
//   }

//   return false;
// };
