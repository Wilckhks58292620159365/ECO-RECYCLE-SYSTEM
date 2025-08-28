import Pickup from "../models/Pickup";


export const wasteService = {
async create(data: {
userId: number;
description: string;
quantity: number;
date: string; // ISO string
imageUrl?: string;
type?: string;
}) {
return Pickup.create({
userId: data.userId,
description: data.description,
quantity: data.quantity,
date: data.date,
image: data.imageUrl ?? null,
type: data.type ?? "",
status: "pending",
points: 0,
});
},


async findAllByUser(userId: number) {
return Pickup.findAll({ where: { userId }, order: [["createdAt", "DESC"]] });
},


async findAll() {
return Pickup.findAll({ order: [["createdAt", "DESC"]] });
},


async confirmPickup(pickupId: number, points: number) {
const pickup = await Pickup.findByPk(pickupId);
if (!pickup) return null;


pickup.status = "confirmed";
pickup.points = points;
await pickup.save();
return pickup;
},
};