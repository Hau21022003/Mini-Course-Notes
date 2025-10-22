import { noteApiRequest } from "@/api-requests/note";
import { handleErrorApi } from "@/lib/error";
import { type Note } from "@/types/note.type";
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

export default function ShareNotePage() {
  const { shareToken } = useParams();
  console.log("shareToken", shareToken);
  const [note, setNote] = useState<Note>();
  useEffect(() => {
    const load = async () => {
      try {
        const rsp = await noteApiRequest.findOnePublic(shareToken || "");
        console.log("rsp", rsp.payload);
        setNote(rsp.payload);
      } catch (error) {
        handleErrorApi({ error });
      }
    };
    if (shareToken) load();
  }, [shareToken]);
  return (
    <div className="px-4 py-6 sm:px-8 sm:py-8 flex flex-col items-center h-screen overflow-scroll">
      <div className="w-full max-w-screen-lg mx-auto space-y-4">
        <p className="">Course: {note?.course?.title}</p>
        <p>Note: {note?.title}</p>
        <p>Note description:</p>
        <div>
          <div
            className="prose prose-sm max-w-none
              [&_p]:my-2
              [&_img]:max-w-full [&_img]:h-auto [&_img]:rounded [&_img]:my-2
              [&_strong]:font-bold
              [&_em]:italic
              [&_ul]:list-disc [&_ul]:pl-6
              [&_ol]:list-decimal [&_ol]:pl-6
              [&_li]:my-1"
            dangerouslySetInnerHTML={{ __html: note?.description || "" }}
          />
        </div>
        {note?.contentUrl && (
          <div className="flex gap-2">
            <p>Note Image:</p>
            <img
              src={note.contentUrl}
              alt=""
              className="w-40 h-40 rounded-md object-cover"
            />
          </div>
        )}
      </div>
    </div>
  );
}
