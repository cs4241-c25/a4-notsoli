import { connect, getImage } from "@/lib/db";

const Error404 = new Response(null, { status: 404 });

export async function GET(_req: Request, { params }: { params: Promise<{ slugs: string[] }> }) {
    // basic validation
    const slugs = (await params).slugs;
    if (slugs.length !== 2) return Error404

    // validate type
    let type: "piece" | "outfit";
    if (slugs[0] == "pieces") type = "piece";
    else if (slugs[0] == "outfits") type = "outfit";
    else return Error404;

    // validate id
    const id = parseInt(slugs[1]);
    if (isNaN(id)) Error404

    // grab image
    await connect();
    const image = await getImage(type, id);
    if (!image) return Error404;

    // split data into type and file content
    const [mimeType, base64Data] = image.data.split(',');
  
    // make blob from file content
    const byteCharacters = atob(base64Data);
    const byteArrays = [];
    for (let i = 0; i < byteCharacters.length; i++)
      byteArrays.push(byteCharacters.charCodeAt(i));
    const byteArray = new Uint8Array(byteArrays);
    const blob = new Blob([byteArray], {type: mimeType});
  
    // convert blob to file
    const file = new File([blob], `${type}-${id}`, {type: 'mime/type'});
    return new Response(file);
}