import asyncHandler from 'express-async-handler';

import {prisma} from '../config/prismaConfig.js'

export const createUser = asyncHandler(async(req,res)=>{
    // console.log("create a user");

    let {email} = req.body;  
    const userExist = await prisma.user.findUnique(
        {
            where:{email:email}
        }
    );
    if(!userExist){
        const user = await prisma.user.create({data:req.body});
        res.send({
            message:"user registered successfully",
            user:user
        });
    }
    else{
        res.status(200).json({
            message:"user already registered"
        });
    }

})

//function to book a visit to residency
export const bookVisit = asyncHandler(async (req, res) => {
    const { email, date } = req.body;
    const { id } = req.params;
  
    try {
      const alreadyBooked = await prisma.user.findUnique({
        where: { email },
        select: { bookedVisits: true },
      });
  
      if (alreadyBooked.bookedVisits.some((visit) => visit.id === id)) {
        res
          .status(400)
          .json({ message: "This residency is already booked by you" });
      } else {
        await prisma.user.update({
          where: { email: email },
          data: {
            bookedVisits: { push: { id, date } },
          },
        });
        res.send("your visit is booked successfully");
      }
    } catch (err) {
      throw new Error(err.message);
    }
  });

// funtion to get all bookings of a user
  export const allBookings=asyncHandler(async(req,res)=>{
    const {email} = req.body;
    try {
        const bookings = await prisma.user.findUnique({
            where:{email:email},
            select:{bookedVisits:true}
        })
        res.status(200).send(bookings);
    } catch (error) {
        throw new Error(error.message);
    }
  })

  //cancel a booking
  export const cancelBooking = asyncHandler(async (req, res) => {
    const { email } = req.body;
    const { id } = req.params;
    try {
      const user = await prisma.user.findUnique({
        where: { email: email },
        select: { bookedVisits: true },
      });
  
      const index = user.bookedVisits.findIndex((visit) => visit.id === id);
  
      if (index === -1) {
        res.status(404).json({ message: "Booking not found" });
      } else {
        user.bookedVisits.splice(index, 1);
        await prisma.user.update({
          where: { email },
          data: {
            bookedVisits: user.bookedVisits,
          },
        });
  
        res.send("Booking cancelled successfully");
      }
    } catch (err) {
      throw new Error(err.message);
    }
  });


  //add and remove residency in fav list of user

 export const toFav=asyncHandler(async(req,res)=>{
    const {email}=req.body;
    const {rid}=req.params;
    try {
        const user=await prisma.user.findUnique({
            where:{email:email},
        })
        //if include rid then remove else add
        if(user.favResidenciesID.includes(rid)){
            const updateUser = await prisma.user.update({
                where:{email:email},
                data:{
                    favResidenciesID:{
                        set:user.favResidenciesID.filter((id)=>id != rid),
                    },
                }
            })
            res.send({message:"Removed from favorites",user:updateUser});
        }
        else{
            const updateUser=await prisma.user.update({
                where:{email:email},
                data:{
                    favResidenciesID:{
                        push:rid,
                    },
                },
            });
            res.send({ message: "Updated favorites", user: updateUser });
        }
    } catch (err) {
        throw new Error(err.message);
    }
  })


  // function to get all favorites
export const getAllFavorites = asyncHandler(async (req, res) => {
    const { email } = req.body;
    try {
      const favResd = await prisma.user.findUnique({
        where: { email },
        select: { favResidenciesID: true },
      });
      res.status(200).send(favResd);
    } catch (err) {
      throw new Error(err.message);
    }
  });