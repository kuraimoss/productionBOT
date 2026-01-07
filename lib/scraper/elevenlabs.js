const stream = require('stream');
const { pipeline } = stream;
const { ElevenLabsClient } = require('@elevenlabs/elevenlabs-js');
const fs = require('fs');
const ffmpeg = require('fluent-ffmpeg');

const textToSpeech = (apikey, teks, voiceid, path) => {
    return new Promise(async(resolve, reject) => {
        try {
            const inputFile = `./temp/${path}.mp3`;
            const outputFile = `./temp/${path}.ogg`;
            const elevenlabs = new ElevenLabsClient({
                apiKey: apikey,
            });

            const audioStream = await elevenlabs.textToSpeech.convert(
                voiceid, // voice_id
                {
                    text: teks,
                    modelId: 'eleven_v3', // eleven_multilingual_v2
                    outputFormat: 'mp3_44100_128', // output_format
                }
            );

            const chunks = [];
            const writable = new stream.Writable({
                write(chunk, encoding, callback) {
                    chunks.push(chunk);
                    callback();
                },
            });

            pipeline(audioStream, writable, async (err) => {
                if (err) {
                    console.error(err);
                    reject(err)
                } else {
                    const audioBuffer = Buffer.concat(chunks);
                    await fs.writeFileSync(inputFile, audioBuffer)
                    ffmpeg(inputFile)
                        .toFormat('ogg')
                        .audioCodec('libopus')
                        .on('end', () => {
                            console.log('Konversi selesai');
                            fs.unlinkSync(inputFile);
                            resolve(outputFile)
                        })
                        .on('error', (err) => {
                            reject(err);
                        })
                        .save(outputFile);
                }
            });
        } catch(e) {
            reject(e)
        }
    })
}

module.exports = { textToSpeech };