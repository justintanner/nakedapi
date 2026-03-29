import { describe, it, expect } from "vitest";
import { fireworks } from "@nakedapi/fireworks";

describe("fireworks audio streaming v2 transcriptions", () => {
  it("should expose streamingV2 method with schema and validation", () => {
    const provider = fireworks({
      apiKey: "fw-test-key",
    });

    expect(provider.v1.audio.transcriptions.streamingV2).toBeDefined();
    expect(typeof provider.v1.audio.transcriptions.streamingV2).toBe(
      "function"
    );
    expect(
      provider.v1.audio.transcriptions.streamingV2.payloadSchema
    ).toBeDefined();
    expect(
      provider.v1.audio.transcriptions.streamingV2.payloadSchema.path
    ).toBe("/v1/audio/transcriptions/streaming");
    expect(
      typeof provider.v1.audio.transcriptions.streamingV2.validatePayload
    ).toBe("function");
  });

  it("should validate streaming v2 options correctly", () => {
    const provider = fireworks({
      apiKey: "fw-test-key",
    });

    const valid = provider.v1.audio.transcriptions.streamingV2.validatePayload({
      language: "en",
      temperature: 0,
    });
    expect(valid.valid).toBe(true);
    expect(valid.errors).toHaveLength(0);

    const invalid =
      provider.v1.audio.transcriptions.streamingV2.validatePayload({
        temperature: "not-a-number",
      });
    expect(invalid.valid).toBe(false);
    expect(invalid.errors.length).toBeGreaterThan(0);
  });

  it("should default to v2 host URL", () => {
    let capturedUrl = "";
    class MockWebSocket {
      send = vi.fn();
      addEventListener = vi.fn();
      constructor(
        public url: string,
        _protocols?: string | string[]
      ) {
        capturedUrl = url;
      }
    }

    const provider = fireworks({
      apiKey: "fw-test-key",
      WebSocket: MockWebSocket as unknown as typeof globalThis.WebSocket,
    });

    provider.v1.audio.transcriptions.streamingV2({
      language: "en",
    });

    expect(capturedUrl).toContain(
      "wss://audio-streaming-v2.api.fireworks.ai/v1/audio/transcriptions/streaming"
    );
    expect(capturedUrl).toContain("Authorization=fw-test-key");
    expect(capturedUrl).toContain("language=en");
  });

  it("should construct WebSocket URL with all query params", () => {
    let capturedUrl = "";
    class MockWebSocket {
      send = vi.fn();
      addEventListener = vi.fn();
      constructor(
        public url: string,
        _protocols?: string | string[]
      ) {
        capturedUrl = url;
      }
    }

    const provider = fireworks({
      apiKey: "fw-test-key",
      WebSocket: MockWebSocket as unknown as typeof globalThis.WebSocket,
    });

    provider.v1.audio.transcriptions.streamingV2({
      language: "ja",
      prompt: "technical discussion",
      temperature: 0,
      timestamp_granularities: ["word", "segment"],
    });

    expect(capturedUrl).toContain(
      "wss://audio-streaming-v2.api.fireworks.ai/v1/audio/transcriptions/streaming"
    );
    expect(capturedUrl).toContain("language=ja");
    expect(capturedUrl).toContain("prompt=technical+discussion");
    expect(capturedUrl).toContain("temperature=0");
    expect(capturedUrl).toContain(
      "timestamp_granularities=" + encodeURIComponent("word,segment")
    );
  });

  it("should allow custom audioStreamingV2BaseURL override", () => {
    let capturedUrl = "";
    class MockWebSocket {
      send = vi.fn();
      addEventListener = vi.fn();
      constructor(
        public url: string,
        _protocols?: string | string[]
      ) {
        capturedUrl = url;
      }
    }

    const provider = fireworks({
      apiKey: "fw-test-key",
      audioStreamingV2BaseURL: "wss://custom-v2.fireworks.ai",
      WebSocket: MockWebSocket as unknown as typeof globalThis.WebSocket,
    });

    provider.v1.audio.transcriptions.streamingV2({
      language: "en",
    });

    expect(capturedUrl).toContain(
      "wss://custom-v2.fireworks.ai/v1/audio/transcriptions/streaming"
    );
  });

  it("should allow per-session baseURL override", () => {
    let capturedUrl = "";
    class MockWebSocket {
      send = vi.fn();
      addEventListener = vi.fn();
      constructor(
        public url: string,
        _protocols?: string | string[]
      ) {
        capturedUrl = url;
      }
    }

    const provider = fireworks({
      apiKey: "fw-test-key",
      WebSocket: MockWebSocket as unknown as typeof globalThis.WebSocket,
    });

    provider.v1.audio.transcriptions.streamingV2({
      language: "en",
      baseURL: "wss://audio-streaming-v2.us-east.direct.fireworks.ai",
    });

    expect(capturedUrl).toContain(
      "wss://audio-streaming-v2.us-east.direct.fireworks.ai/v1/audio/transcriptions/streaming"
    );
  });

  it("should create a streaming session with expected API", () => {
    const mockSend = vi.fn();
    class MockWebSocket {
      send = mockSend;
      addEventListener = vi.fn();
      constructor(_url: string, _protocols?: string | string[]) {}
    }

    const provider = fireworks({
      apiKey: "fw-test-key",
      WebSocket: MockWebSocket as unknown as typeof globalThis.WebSocket,
    });

    const session = provider.v1.audio.transcriptions.streamingV2({
      language: "en",
      timestamp_granularities: ["word", "segment"],
    });

    expect(session).toBeDefined();
    expect(typeof session.send).toBe("function");
    expect(typeof session.clearState).toBe("function");
    expect(typeof session.trace).toBe("function");
    expect(typeof session.close).toBe("function");
    expect(typeof session[Symbol.asyncIterator]).toBe("function");
  });

  it("should send binary audio data via session.send", () => {
    const mockSend = vi.fn();
    class MockWebSocket {
      send = mockSend;
      addEventListener = vi.fn();
      constructor(_url: string, _protocols?: string | string[]) {}
    }

    const provider = fireworks({
      apiKey: "fw-test-key",
      WebSocket: MockWebSocket as unknown as typeof globalThis.WebSocket,
    });

    const session = provider.v1.audio.transcriptions.streamingV2();
    const audioChunk = new Uint8Array([1, 2, 3, 4]);
    session.send(audioChunk);

    expect(mockSend).toHaveBeenCalledWith(audioChunk);
  });

  it("should send clearState event", () => {
    const mockSend = vi.fn();
    class MockWebSocket {
      send = mockSend;
      addEventListener = vi.fn();
      constructor(_url: string, _protocols?: string | string[]) {}
    }

    const provider = fireworks({
      apiKey: "fw-test-key",
      WebSocket: MockWebSocket as unknown as typeof globalThis.WebSocket,
    });

    const session = provider.v1.audio.transcriptions.streamingV2();
    session.clearState("reset-v2-123");

    expect(mockSend).toHaveBeenCalledTimes(1);
    const parsed = JSON.parse(mockSend.mock.calls[0][0]);
    expect(parsed.object).toBe("stt.state.clear");
    expect(parsed.reset_id).toBe("reset-v2-123");
    expect(parsed.event_id).toBeDefined();
  });

  it("should send trace event", () => {
    const mockSend = vi.fn();
    class MockWebSocket {
      send = mockSend;
      addEventListener = vi.fn();
      constructor(_url: string, _protocols?: string | string[]) {}
    }

    const provider = fireworks({
      apiKey: "fw-test-key",
      WebSocket: MockWebSocket as unknown as typeof globalThis.WebSocket,
    });

    const session = provider.v1.audio.transcriptions.streamingV2();
    session.trace("trace-v2-456");

    expect(mockSend).toHaveBeenCalledTimes(1);
    const parsed = JSON.parse(mockSend.mock.calls[0][0]);
    expect(parsed.object).toBe("stt.input.trace");
    expect(parsed.trace_id).toBe("trace-v2-456");
    expect(parsed.event_id).toBeDefined();
  });

  it("should send final checkpoint on close", () => {
    const mockSend = vi.fn();
    class MockWebSocket {
      send = mockSend;
      addEventListener = vi.fn();
      constructor(_url: string, _protocols?: string | string[]) {}
    }

    const provider = fireworks({
      apiKey: "fw-test-key",
      WebSocket: MockWebSocket as unknown as typeof globalThis.WebSocket,
    });

    const session = provider.v1.audio.transcriptions.streamingV2();
    session.close();

    expect(mockSend).toHaveBeenCalledTimes(1);
    const parsed = JSON.parse(mockSend.mock.calls[0][0]);
    expect(parsed.checkpoint_id).toBe("final");
  });

  it("should yield transcription messages via async iterator", async () => {
    type Listener = (event: { data: string }) => void;
    const listeners: Record<string, Listener[]> = {};

    class MockWebSocket {
      send = vi.fn();
      addEventListener(event: string, fn: Listener) {
        if (!listeners[event]) listeners[event] = [];
        listeners[event].push(fn);
      }
      constructor(_url: string, _protocols?: string | string[]) {}
    }

    const provider = fireworks({
      apiKey: "fw-test-key",
      WebSocket: MockWebSocket as unknown as typeof globalThis.WebSocket,
    });

    const session = provider.v1.audio.transcriptions.streamingV2({
      language: "en",
    });

    const transcriptionResult = {
      task: "transcribe",
      language: "en",
      text: "Hello world",
      segments: [{ id: 0, text: "Hello world", language: "en" }],
    };

    const checkpoint = { checkpoint_id: "final" };

    // Simulate server messages
    setTimeout(() => {
      for (const fn of listeners["message"] ?? []) {
        fn({ data: JSON.stringify(transcriptionResult) });
      }
      for (const fn of listeners["message"] ?? []) {
        fn({ data: JSON.stringify(checkpoint) });
      }
      for (const fn of listeners["close"] ?? []) {
        (fn as () => void)();
      }
    }, 10);

    const messages = [];
    for await (const msg of session) {
      messages.push(msg);
      if ("checkpoint_id" in msg && msg.checkpoint_id === "final") {
        break;
      }
    }

    expect(messages).toHaveLength(2);
    expect(messages[0]).toEqual(transcriptionResult);
    expect(messages[1]).toEqual(checkpoint);
  });

  it("should use different default URL than v1 streaming", () => {
    let v1Url = "";
    let v2Url = "";

    class MockWebSocket {
      send = vi.fn();
      addEventListener = vi.fn();
      constructor(
        public url: string,
        _protocols?: string | string[]
      ) {}
    }

    // Capture v1 URL
    const CaptureV1 = class extends MockWebSocket {
      constructor(url: string, protocols?: string | string[]) {
        super(url, protocols);
        v1Url = url;
      }
    };

    const p1 = fireworks({
      apiKey: "fw-test-key",
      WebSocket: CaptureV1 as unknown as typeof globalThis.WebSocket,
    });
    p1.v1.audio.transcriptions.streaming();

    // Capture v2 URL
    const CaptureV2 = class extends MockWebSocket {
      constructor(url: string, protocols?: string | string[]) {
        super(url, protocols);
        v2Url = url;
      }
    };

    const p2 = fireworks({
      apiKey: "fw-test-key",
      WebSocket: CaptureV2 as unknown as typeof globalThis.WebSocket,
    });
    p2.v1.audio.transcriptions.streamingV2();

    expect(v1Url).toContain("wss://audio-streaming.api.fireworks.ai");
    expect(v2Url).toContain("wss://audio-streaming-v2.api.fireworks.ai");
    expect(v1Url).not.toEqual(v2Url);
  });
});
