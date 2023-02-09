import { createReadStream, ReadStream } from 'fs';

export default class Service {
  streamFile(filePath: string): ReadStream {
    return createReadStream(filePath);
  }

  // if I type the stream, the pipeline complains that I'm not passing parameters to the function
  // How do I solve it without `any`?
  async *transform(streams: any) {
    let keys: string[] = [];
    streams.setEncoding('utf8');
    for await (const chunk of streams) {
      // csv file splits at \r\n\r\n
      const lines = chunk.split(/\r\n\r\n/);
      for (const line of lines) {
        if (keys.length < 1) {
          keys = [...line.split(',')];
          continue;
        }

        const props = line.split(',');

        const mountedObj = Object.fromEntries(
          keys.map((_, i) => [keys[i], props[i]])
        );

        yield mountedObj;
      }
    }
  }

  // if I type the stream, the pipeline complains that I'm not passing parameters to the function
  // How do I solve it without `any`?
  async *write(stream: any) {
    for await (const chunk of stream) {
      console.log('[todo]: write to files specific to each player position');
    }
  }
}
