import { Link } from "react-router";
import ScoreCircle from "./ScoreCircle";
import { usePuterStore } from "~/lib/puter";
import { useEffect, useState } from "react";

export const ResumeCard = ({ resume :{id, companyName, jobTitle, imagePath, feedback}}: { resume: Resume }) => {
    const {fs} = usePuterStore();
    const [resumeUrl, setResumeUrl] = useState('');


    useEffect(() => {
        const loadResume = async () => {
          const blob = await fs.read(imagePath)
          if(!blob) return;
          let url = URL.createObjectURL(blob);
          setResumeUrl(url);
      }
      loadResume();
     }, [imagePath])


    return (
        <Link to={`/resume/${id}`} className="resume-card animate-in fade-in duration-1000 ">
            <div className="resume-card-header">
                <div className="flex flex-col gap-2">
                    {companyName &&<h2 className="!text-black font-bold break-words">{companyName}</h2>}
                    {jobTitle &&<h3 className="text-lg break-words text-gray-500">{jobTitle}</h3>}
                    {!companyName && !jobTitle && <h3 className="text-lg break-words text-gray-500">No company or job title</h3>}
                </div>

                <div className="flex-shrink-0">
                    <ScoreCircle score={feedback.overallScore} />
                </div>
            </div>
            {resumeUrl && (
                <div className="gradient-border animate-in fade-in duration-1000">
                    <div className="w-full h-full">
                       <img
                            src={resumeUrl}
                            alt="resume image"
                            className="w-full h-[350px] object-cover max-sm:h-[250px] object-top"
                        />
                </div>
             </div>
            )}
        </Link>
    )
}
