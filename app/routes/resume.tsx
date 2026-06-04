import { Link, useNavigate, useParams } from "react-router";
import type { Route } from "../+types/root";
import { useEffect, useState } from "react";
import { usePuterStore } from "~/lib/puter";
import Summary from "~/components/Summary";
import Details from "~/components/Details";
import ATS from "~/components/ATS";

export const meta = () => {
    return ([
        {title: 'Resumind | Đánh giá CV của bạn'},
        {name: 'Mô tả', content: 'Mô tả chi tiết về hồ sơ/CV của bạn'},
    ])
}

export default function Resume() {
    const {auth, kv, ai, fs, isLoading} = usePuterStore();

    const {id} = useParams();

    const [imageUrl, setImageUrl] = useState('');
    const [resumeUrl, setResumeUrl] = useState('');
    const [feedback, setFeedback] = useState<Feedback | null>(null);

    const navigate = useNavigate();

    useEffect(() => {
        if (!isLoading && !auth.isAuthenticated) {
            navigate(`/auth?next=/resume/${id}`);
        }
    }, [isLoading]);

    useEffect(() => {
        const loadResume = async () => {
            const resume = await kv.get(`resume:${id}`);

            if(!resume) return;
            const data = JSON.parse(resume);

            const resumeBlob = await fs.read(data.resumePath);
            if(!resumeBlob) return;

            const pdfBlob = new Blob([resumeBlob], { type: 'application/pdf' });
            const resumeUrl = URL.createObjectURL(pdfBlob);
            setResumeUrl(resumeUrl);

            const imageBlob = await fs.read(data.imagePath);
            if(!imageBlob) return;

            const imageUrl = URL.createObjectURL(imageBlob);
            setImageUrl(imageUrl);

            setFeedback(data.feedback);
            console.log({resumeUrl, imageUrl, feedback: data.feedback});
        }
        loadResume();
    }, [id])
    
  return (
    <main className="!pt-0">
        <nav className="resume-nav">
            <Link to="/" className="back-button">
                <img src="/icons/back.svg" alt="back" className="w-3 h-3"/>
                <span className="text-gray-500 text-sm font-semibold"> Trở về Trang chủ</span>
            </Link>
        </nav>
        <div className="flex flex-row w-full max-lg:flex-col-reverse">
            <section className="feedback-section bg-[url('/images/bg-small.svg')] bg-cover h-[100vh] sticky top-0 items-center justify-center">
                {imageUrl && resumeUrl && (
                    <div className=" animate-in fade-in duration-1000 gradient-border max-sm:m-0 h-[90%] max-w-xl:h-fit w-fit">
                        <a href={resumeUrl} target="_blank" rel="noopener noreferrer">  {/* Nhấn vào để xem CV, chuyển tab */}
                        <img
                            src={imageUrl}
                            alt="resume image"
                            className="w-full h-full object-contain rounded-2xl"
                        />
                        </a>
                    </div>
                )}
            </section>
            <section className="feedback-section">
                <h2 className="text-4xl !text-black font-bold">
                    Đánh giá CV của bạn
                </h2>
                    {feedback ? (
                        <div className="flex flex-col gap-8 animate-in fade-in duration-1000">
                            <Summary feedback={feedback}/>
                            <ATS score={feedback.ATS.score || 0} suggestions={feedback.ATS.tips || []} />
                            <Details feedback={feedback} />
                            
                        </div>
                    ) : (
                           <img src="/images/resume-scan-2.gif" alt="loading" className="w-full" />
                    )}
            </section>

        </div>
    </main>
  )
}