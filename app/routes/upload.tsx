import { Navbar } from "~/components/Navbar";
import type { Route } from "./+types/upload";
import { useState, type FormEvent } from "react";
import FileUploader from "~/components/FileUploader";

export function loader({}: Route.LoaderArgs) {
  return null;
}

export default function Upload() {
    const [isProcessing, setIsProcessing] = useState(false);
    const [statusText, setStatusText] = useState('');
    const [file, setFile] = useState<File | null>(null);

    const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const form = e.currentTarget.closest('form');
        if (!form) return;
        const formData = new FormData(form);

        const companyName = formData.get('company-name');
        const jobTitle = formData.get('job-title');
        const jobDescription = formData.get('job-description');

        console.log({
            companyName,
            jobTitle,
            jobDescription,
            file,
        })
    }

    const handleFileSelect = (file: File | null) => {
        setFile(file);
    }

  return (
  <main className="bg-[url('/images/bg-main.svg')] bg-cover">
      <Navbar />
      <section className="main-section">
        <div className="page-heading py-16">
            <h1>Smart feedback for your dream</h1>
            {isProcessing ? (
                <>
                <h2>{statusText}</h2>
                <img src='/images/resume-scan.gif' className="w-full" />
                
                </>
            ): (
                <h2>Drop yuor resume for an ATS score and improvement</h2>
            )}

            {!isProcessing && (
                <form id="upload-form" onClick={handleSubmit} className="flex flex-col gap-4 mt-8">
                    <div className="form-div">
                        <label htmlFor="company-name">Company Name</label>
                        <input type="text" placeholder="Company Name" name="company-name" />
                    </div>

                    <div className="form-div">
                        <label htmlFor="job-title">Job Title</label>
                        <input type="text" placeholder="Job Title" name="job-title" />
                    </div>

                    <div className="form-div">
                        <label htmlFor="job-description">Job Description</label>
                        <textarea  rows={5} placeholder="Write a clear & concise job description with responsibilities & expectations..." name="job-title" />
                    </div>


                    <div className="form-div">
                        <label htmlFor="upload-resume">Upload Resume</label>
                        <FileUploader onFileSelect={handleFileSelect}/>
                    </div>

                    <button type="submit" className="primary-button">
                        Upload Resume
                    </button>


                </form>
            )}
        </div>
      </section>

  </main>

)
}
