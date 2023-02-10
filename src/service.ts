import {
  appendFile,
  appendFileSync,
  createReadStream,
  ReadStream,
  writeFile,
} from 'fs';

export default class Service {
  async *streamFile(filePath: string) {
    return createReadStream(filePath);
  }

  // if I type the stream, the pipeline complains that I'm not passing parameters to the function
  // How do I solve it without `any`?
  async *transform(streams: any) {
    let keys: string[] = [];
    streams.setEncoding('utf8');
    for await (const chunk of streams) {
      // csv file splits at \r\n\r\n
      const lines = chunk.split(/\r?\n|\r|\n/g);
      for (const line of lines) {
        if (keys.length < 1) {
          keys = [...line.split(',')];
          continue;
        }

        const props = line.split(',');

        const posIdx = keys.indexOf('player_positions');

        const mountedObj = Object.fromEntries(
          keys.map((_, i) => {
            if (i === posIdx) {
              return [keys[i] || '', props[i] ? props[i].replace('"', '') : ''];
            }
            return [keys[i] || '', props[i] || ''];
          })
        );

        if (
          mountedObj.player_positions &&
          !parseInt(mountedObj.player_positions) &&
          mountedObj.player_positions.trim().length < 4
        ) {
          yield mountedObj;
        }
      }
    }
  }

  // if I type the stream, the pipeline complains that I'm not passing parameters to the function
  // How do I solve it without `any`?
  async *write(stream: any) {
    for await (const chunk of stream) {
      if (chunk.player_positions) {
        appendFile(
          `parsed/players/${chunk.player_positions}.ndjson`,
          `${JSON.stringify(chunk)}\n`,
          (err: any) => {
            if (err && err.code === 'ENOENT')
              return console.error(
                'Please create the directory for the files and try again.'
              );
          }
        );
      }
    }
  }
}
