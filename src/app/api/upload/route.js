import { NextResponse } from "next/server";
import imagekit from "../../../../lib/imagekit";

export async function POST(req) {
  const formData = await req.formData();
  const file = formData.get("file");
  const fileName = formData.get("fileName");

  const bytes = await file.arrayBuffer();
  const buffer = Buffer.from(bytes);

  const result = await imagekit.upload({
    file: buffer,
    fileName,
  });

  return NextResponse.json({ url: result.url });
}

// import { NextResponse } from "next/server";
// import { createWriteStream } from "fs";
// import { tmpdir } from "os";
// import path from "path";
// import { v4 as uuidv4 } from "uuid";
// import { pipeline } from "stream/promises";
// import cloudinary from "../../../../lib/cloudinary";

// export const dynamic = "force-dynamic";

// export async function POST(req) {
//   const formData = await req.formData();
//   const file = formData.get("file");

//   if (!file || typeof file === "string") {
//     return NextResponse.json({ error: "No file received." }, { status: 400 });
//   }

//   const filename = file.name || `${uuidv4()}.pdf`;
//   const tempFilePath = path.join(tmpdir(), `${uuidv4()}-${filename}`);

//   try {
//     // ✅ Save file stream to disk (avoids corruption)
//     const fileStream = file.stream();
//     const writeStream = createWriteStream(tempFilePath);
//     await pipeline(fileStream, writeStream);

//     // ✅ Upload to Cloudinary as raw
//     const result = await cloudinary.uploader.upload(tempFilePath, {
//       folder: "uploads",
//       resource_type: "raw",
//       public_id: path.parse(filename).name,
//       format: "pdf",
//     });

//     return NextResponse.json({ url: result.secure_url });
//   } catch (error) {
//     return NextResponse.json({ error: error.message }, { status: 500 });
//   }
// }
