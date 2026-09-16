import Foundation
import Vision
import AppKit

func ocrImage(path: String) -> String {
    guard let image = NSImage(contentsOfFile: path),
          let cgImage = image.cgImage(forProposedRect: nil, context: nil, hints: nil) else {
        return ""
    }
    
    var resultText = ""
    let request = VNRecognizeTextRequest { req, error in
        guard let observations = req.results as? [VNRecognizedTextObservation] else { return }
        for observation in observations {
            if let topCandidate = observation.topCandidates(1).first {
                resultText += topCandidate.string + "\n"
            }
        }
    }
    request.recognitionLevel = .accurate
    request.recognitionLanguages = ["es-ES", "en-US"]
    
    let handler = VNImageRequestHandler(cgImage: cgImage, options: [:])
    do {
        try handler.perform([request])
    } catch {
        return ""
    }
    return resultText
}

let args = CommandLine.arguments
if args.count < 2 {
    print("Usage: ocr_bin <dir_or_file>")
    exit(1)
}

let target = args[1]
let fm = FileManager.default

var isDir: ObjCBool = false
if fm.fileExists(atPath: target, isDirectory: &isDir) {
    if isDir.boolValue {
        let files = (try? fm.contentsOfDirectory(atPath: target)) ?? []
        // sort by number in filename
        let sortedFiles = files.filter { $0.hasSuffix(".png") || $0.hasSuffix(".jpg") || $0.hasSuffix(".jpeg") }
            .sorted { a, b in
                let numA = Int(a.components(separatedBy: CharacterSet.decimalDigits.inverted).joined()) ?? 0
                let numB = Int(b.components(separatedBy: CharacterSet.decimalDigits.inverted).joined()) ?? 0
                return numA < numB
            }
        
        for file in sortedFiles {
            let fullPath = (target as NSString).appendingPathComponent(file)
            let text = ocrImage(path: fullPath)
            print("--- SLIDE: \(file) ---")
            print(text.trimmingCharacters(in: .whitespacesAndNewlines))
        }
    } else {
        let text = ocrImage(path: target)
        print(text.trimmingCharacters(in: .whitespacesAndNewlines))
    }
}
