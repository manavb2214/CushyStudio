import { execSync } from 'child_process'
import { extractErrorMessage } from '../utils/extractErrorMessage'
import { writeFileSync } from 'fs'

export async function createMP4FromImages(
    //
    imageFiles: string[],
    outputVideo: string,
    /** FPS (e.g. 60, 30, etc.) default is 30 */
    inputFPS: number = 30,
    workingDirectory: string,
    opts?: {
        transparent?: Maybe<boolean>
    },
): Promise<void> {
    const outputVideoFramePaths = outputVideo + '.frames.txt'
    writeFileSync(outputVideoFramePaths, imageFiles.map((path) => `file '${path}'`).join('\n'), 'utf-8')
    // Create the input file arguments for ffmpeg
    // const inputArgs = imageFiles.map((path, index) => `-loop 1 -t ${frameDuration / 1000} -i "${path}"`).join(' ')

    // Output video file
    // const outputVideo = outputVideo // 'output.mp4'

    // Additional ffmpeg arguments for encoding
    // const encodingArgs = `-filter_complex "concat=n=${imageFiles.length}:v=1:a=0,format=yuv420p" -c:v libx264 -preset veryfast -crf 23`

    // Construct the full ffmpeg command
    // const ffmpegCommand = `ffmpeg ${inputArgs} ${encodingArgs} "${outputVideo}"`
    const transparent = opts?.transparent ? '-pix_fmt yuva420p ' : '-pix_fmt yuva420p ' // 🔴
    const ffmpegCommand = `ffmpeg -f concat -safe 0 -r ${inputFPS} -i "${outputVideoFramePaths}" -c:v libx264 -vf "fps=60" ${transparent}"${outputVideo}"`

    console.info(`Working directory: ${workingDirectory}`)
    console.info(`Creating video with command: ${ffmpegCommand}`)

    try {
        const res = execSync(ffmpegCommand, { cwd: workingDirectory })
        const str = res.toString()
        // console.info(`[stdout] ${res.stdout}`)
        // console.info(`[stderr] ${res.stderr}`)
        console.info(`[out] ${res}`)
        console.info(`Video created successfully: ${outputVideo}`)
    } catch (error) {
        console.error('Error creating video:', extractErrorMessage(error))
    }
}
