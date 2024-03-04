// import BollyMovie from "@/models/bollyMovieModel";
// import { aggregate } from "@/helpers/aggregateHelpers/aggregationHelper";
// import getPaginationObject from "@/helpers/getPaginationObject";
// import { createSortStage } from "@/helpers/aggregateHelpers/aggregationQueryHelper";
// import { connectToDatabase } from "@/utils/db";
// import { createPaginationStages } from "@/helpers/aggregateHelpers/limitStageHelper";
// const {
//   createMatchRegexStage,
//   createMatchInStage,
// } = require("../../../helpers/aggregateHelpers/matchStageHelper");
// import { connectToDatabase } from "@/utils/db";
// import cors from "micro-cors";
// const corsMiddleware = cors();
// export default async function handler(req, res) {
//   if (req.method !== "POST") {
//     return res.status(405).json({ error: "Method Not Allowed" });
//   }
//   await corsMiddleware(req, res);
// import cors from "micro-cors";
// const corsMiddleware = cors();
//   // Connect to the database
//   await connectToDatabase();
//   try {
//     const {
//       pageNumber,
//       pageSize,
//       search,
//       language,
//       releasedYear,
//       size,
//       quality,
//       source,
//       genres,
//     } = req.query;

//     const pipeline = [];

//     if (search) {
//       pipeline.push(createMatchRegexStage("movieDetails.title", search));
//     }
//     if (language) {
//       pipeline.push(createMatchRegexStage("movieDetails.language", language));
//     }
//     if (releasedYear) {
//       pipeline.push(
//         createMatchRegexStage("movieDetails.releasedYear", releasedYear)
//       );
//     }
//     if (size) {
//       pipeline.push(createMatchRegexStage("movieDetails.size", size));
//     }
//     if (quality) {
//       pipeline.push(createMatchRegexStage("movieDetails.quality", quality));
//     }
//     if (source) {
//       pipeline.push(createMatchRegexStage("movieDetails.source", source));
//     }
//     if (genres) {
//       pipeline.push(createMatchInStage("movieDetails.genres", [genres]));
//     }
//     if(!search && !genres){
//       pipeline.push(createSortStage("created_at", -1));
//     }
//     if (
//       pageNumber &&
//       pageSize &&
//       (!(genres && Array.isArray(genres)) || search)
//     ) {
//       pipeline.push(
//         ...createPaginationStages(Number(pageNumber), Number(pageSize))
//       );
//     }

//     pipeline.push(
//       {
//         $addFields: {
//           "movieDetails.releasedYear": {
//             $cond: {
//               if: {
//                 $regexMatch: {
//                   input: "$movieDetails.releasedYear",
//                   regex: /^[0-9]{4}/,
//                 },
//               },
//               then: {
//                 $trim: { input: "$movieDetails.releasedYear", chars: "–- " },
//               },
//               else: "$movieDetails.releasedYear",
//             },
//           },
//         },
//       },
//       {
//         $match: {
//           downloadVarieties: {
//             $exists: true,
//             $not: { $size: 0 },
//             $not: { $size: 1 },
//           },
//         },
//       }
//     );
//     if(search || genres){
//       pipeline.push(createSortStage("movieDetails.releasedYear", -1));
//     }

//     const totalResults = await BollyMovie.countDocuments().exec();
//     const movies = await aggregate("bollymovies", pipeline);
//     const paginationObject = await getPaginationObject(
//       movies,
//       pageNumber,
//       pageSize,
//       totalResults
//     );

//     return res.status(200).json({ movies, meta: paginationObject });
//   } catch (error) {
//     console.error("Error:", error);
//     res.status(500).json({ error: "Internal Server Error" });
//   }
// }








