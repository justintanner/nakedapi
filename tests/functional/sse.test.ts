// Tests for SSE parsers — pure stream parsing, no API calls
import { describe, it, expect } from "vitest";
import { sseToIterable as kimiSse } from "../../packages/provider/kimicoding/src/sse";
import { sseToIterable as kieSse } from "../../packages/provider/kie/src/sse";

function makeResponse(chunks: string[]): Response {
  const encoder = new TextEncoder();
  let index = 0;
  const stream = new ReadableStream({
    pull(controller) {
      if (index < chunks.length) {
        controller.enqueue(encoder.encode(chunks[index]));
        index++;
      } else {
        controller.close();
      }
    },
  });
  return new Response(stream, {
    status: 200,
    headers: { "Content-Type": "text/event-stream" },
  });
}

describe("kimicoding sseToIterable", () => {
  it("parses event and data fields", async () => {
    const res = makeResponse([
      'event: content_block_delta\ndata: {"text":"Hello"}\n\n',
    ]);
    const events = [];
    for await (const ev of kimiSse(res)) {
      events.push(ev);
    }
    expect(events).toHaveLength(1);
    expect(events[0].event).toBe("content_block_delta");
    expect(events[0].data).toBe('{"text":"Hello"}');
  });

  it("defaults event to 'message' when not specified", async () => {
    const res = makeResponse(["data: hello\n\n"]);
    const events = [];
    for await (const ev of kimiSse(res)) {
      events.push(ev);
    }
    expect(events[0].event).toBe("message");
  });

  it("handles multiple events in one chunk", async () => {
    const res = makeResponse([
      "event: a\ndata: first\n\nevent: b\ndata: second\n\n",
    ]);
    const events = [];
    for await (const ev of kimiSse(res)) {
      events.push(ev);
    }
    expect(events).toHaveLength(2);
    expect(events[0]).toEqual({ event: "a", data: "first" });
    expect(events[1]).toEqual({ event: "b", data: "second" });
  });

  it("handles events split across chunks", async () => {
    const res = makeResponse(["event: delta\nda", 'ta: {"split":true}\n\n']);
    const events = [];
    for await (const ev of kimiSse(res)) {
      events.push(ev);
    }
    expect(events).toHaveLength(1);
    expect(events[0].data).toBe('{"split":true}');
  });

  it("skips events without data", async () => {
    const res = makeResponse(["event: ping\n\ndata: real\n\n"]);
    const events = [];
    for await (const ev of kimiSse(res)) {
      events.push(ev);
    }
    expect(events).toHaveLength(1);
    expect(events[0].data).toBe("real");
  });

  it("flushes trailing event without final delimiter", async () => {
    const res = makeResponse(["data: trailing"]);
    const events = [];
    for await (const ev of kimiSse(res)) {
      events.push(ev);
    }
    expect(events).toHaveLength(1);
    expect(events[0].data).toBe("trailing");
  });

  it("returns nothing for null body", async () => {
    const res = new Response(null);
    const events = [];
    for await (const ev of kimiSse(res)) {
      events.push(ev);
    }
    expect(events).toHaveLength(0);
  });

  it("handles CRLF line endings", async () => {
    const res = makeResponse(["event: test\r\ndata: crlf\r\n\r\n"]);
    const events = [];
    for await (const ev of kimiSse(res)) {
      events.push(ev);
    }
    expect(events).toHaveLength(1);
    expect(events[0]).toEqual({ event: "test", data: "crlf" });
  });
});

describe("kie sseToIterable", () => {
  it("yields data strings", async () => {
    const res = makeResponse(["data: payload1\n\ndata: payload2\n\n"]);
    const items = [];
    for await (const data of kieSse(res)) {
      items.push(data);
    }
    expect(items).toEqual(["payload1", "payload2"]);
  });

  it("ignores non-data lines", async () => {
    const res = makeResponse([": comment\nevent: update\ndata: payload\n\n"]);
    const items = [];
    for await (const data of kieSse(res)) {
      items.push(data);
    }
    expect(items).toEqual(["payload"]);
  });

  it("handles split across chunks", async () => {
    const res = makeResponse(["da", "ta: split\n\n"]);
    const items = [];
    for await (const data of kieSse(res)) {
      items.push(data);
    }
    expect(items).toEqual(["split"]);
  });

  it("flushes trailing data", async () => {
    const res = makeResponse(["data: final"]);
    const items = [];
    for await (const data of kieSse(res)) {
      items.push(data);
    }
    expect(items).toEqual(["final"]);
  });

  it("returns nothing for null body", async () => {
    const res = new Response(null);
    const items = [];
    for await (const data of kieSse(res)) {
      items.push(data);
    }
    expect(items).toHaveLength(0);
  });

  it("yields each data line in multi-data events", async () => {
    const res = makeResponse(["data: line1\ndata: line2\n\n"]);
    const items = [];
    for await (const data of kieSse(res)) {
      items.push(data);
    }
    expect(items).toEqual(["line1", "line2"]);
  });
});
