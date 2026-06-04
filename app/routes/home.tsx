import type { Route } from "./+types/home";
import { Navbar } from "~/components/Navbar";
import { ResumeCard } from "~/components/ResumeCard";
import { usePuterStore } from "~/lib/puter";
import { Link, useNavigate } from "react-router";
import { useEffect, useState } from "react";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Resumind" },
    {
      name: "description",
      content: "Resumind là công cụ giúp bạn phân tích CV và cung cấp những đánh giá, gợi ý để cải thiện CV hiệu quả hơn.",
    },
  ];
}

export default function Home() {
  const { auth, kv } = usePuterStore();
  const [resumes, setResumes] = useState<Resume[]>([]);
  const [loadingResumes, setLoadingResumes] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (!auth.isAuthenticated) {
      navigate("/auth?next=/");
    }
  }, [auth.isAuthenticated, navigate]);

  useEffect(() => {
    const loadResumes = async () => {
      setLoadingResumes(true);

      const items = (await kv.list("resume:*", true)) as KVItem[];
      const parsedResumes =
        items?.map((item) => JSON.parse(item.value) as Resume) ?? [];

      setResumes(parsedResumes);
      setLoadingResumes(false);
    };

    loadResumes();
  }, [kv]);

  return (
    <main className="bg-[url('/images/bg-main.svg')] bg-cover">
      <Navbar />

      <section className="main-section">
        <div className="page-heading py-16">
          <h1>Theo dõi hồ sơ ứng tuyển và điểm đánh giá CV của bạn</h1>
          {!loadingResumes && resumes.length === 0 ? (
            <h2>
              Chưa có CV nào. Tải CV đầu tiên để nhận đánh giá từ AI.
            </h2>
          ) : (
            <h2>Xem lại các bài nộp và phản hồi từ AI.</h2>
          )}
        </div>

        {loadingResumes && (
          <div className="flex flex-col items-center justify-center gap-4">
            <img src="images/resume-scan-2.gif" alt="loading" className="w-full max-w-md"/>
            <p>Đang tải các CV của bạn...</p>
          </div>
        )}

        {loadingResumes && (
          <img
            src="/images/resume-scan-2.gif"
            alt="loading"
            className="w-full max-w-md"
          />
        )}

        {!loadingResumes && resumes.length > 0 && (
          <div className="resumes-section">
            {resumes.map((resume) => (
              <ResumeCard key={resume.id} resume={resume} />
            ))}
          </div>
        )}

        {!loadingResumes && resumes.length === 0 && (
          <div className="flex flex-col items-center justify-center gap-4">
            <img src="images/resume-scan-2.gif" alt="loading" className="w-full max-w-md"/>
            <p>Đang tải các CV của bạn...</p>
          </div>
        )}

        {!loadingResumes && resumes.length === 0 && (
          <div className="flex flex-col items-center justify-center gap-4">
            <Link to="/upload" className="primary-button max-w-md">
            Tải CV lên
          </Link>
          </div>
        )}
      </section>
    </main>
  );
}
