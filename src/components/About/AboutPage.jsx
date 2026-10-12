import { useEffect, useMemo, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import {
  FaUsers,
  FaNewspaper,
  FaPenNib,
  FaBookOpen,
  FaBullseye,
  FaBolt,
  FaHandshake,
  FaSyncAlt,
  FaCheck,
  FaRegEnvelope,
  FaLinkedinIn,
  FaGithub,
} from "react-icons/fa";

const DATA_URL = "/Data/posts.json";

// القيم (محتوى ثابت)
const VALUES = [
  { icon: <FaBullseye />, title: "الجودة أولاً", text: "محتوى مدروس ومكتوب بخبرة" },
  { icon: <FaBolt />, title: "تركيز عملي", text: "أمثلة واقعية يمكنك تطبيقها اليوم" },
  { icon: <FaHandshake />, title: "المجتمع", text: "تعلم مع آلاف المصورين" },
  { icon: <FaSyncAlt />, title: "دائماً محدث", text: "أحدث الاتجاهات وأفضل الممارسات" },
];

// أيقونة X (تويتر سابقاً) كـ SVG حتى لا نعتمد على نسخة معينة من react-icons
const XIcon = () => (
  <svg viewBox="0 0 24 24" className="h-3.5 w-3.5" fill="currentColor" aria-hidden="true">
    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
  </svg>
);

// صورة الكاتب: لو فشلت تظهر أول حرف من الاسم
function AuthorAvatar({ src, name }) {
  const [failed, setFailed] = useState(false);

  return (
    <div className="relative">
      {src && !failed ? (
        <img
          src={src}
          alt={name}
          loading="lazy"
          onError={() => setFailed(true)}
          className="h-16 w-16 rounded-full object-cover ring-2 ring-white/10"
        />
      ) : (
        <div className="flex h-16 w-16 items-center justify-center rounded-full bg-orange-500/20 text-xl font-bold text-orange-400 ring-2 ring-white/10">
          {name?.charAt(0) || "؟"}
        </div>
      )}
      <span
        className="absolute -bottom-0.5 -right-0.5 flex h-5 w-5 items-center justify-center rounded-full border-2 border-[#141414] bg-orange-500 text-[9px] text-white"
        aria-hidden="true"
      >
        <FaCheck />
      </span>
    </div>
  );
}

const socialBtn =
  "flex h-7 w-7 items-center justify-center rounded-md bg-white/5 text-gray-400 transition hover:bg-orange-500/20 hover:text-orange-400 focus:outline-none focus-visible:ring-2 focus-visible:ring-orange-500/50";

export default function AboutPage() {
  const [data, setData] = useState(null);
  const [status, setStatus] = useState("loading"); // loading | error | ready
  const [reloadKey, setReloadKey] = useState(0);

  useEffect(() => {
    let cancelled = false;
    setStatus("loading");
    axios
      .get(DATA_URL)
      .then((res) => {
        if (cancelled) return;
        setData(res.data);
        setStatus("ready");
      })
      .catch(() => {
        if (!cancelled) setStatus("error");
      });
    return () => {
      cancelled = true;
    };
  }, [reloadKey]);

  const posts = data?.posts ?? [];
  const social = data?.siteInfo?.social ?? {};
  const email = data?.siteInfo?.email;

  // الكتّاب بدون تكرار (من بيانات المقالات الفعلية)
  const authors = useMemo(() => {
    const map = new Map();
    posts.forEach((p) => {
      const a = p.author;
      if (a?.name && !map.has(a.name)) map.set(a.name, a);
    });
    return [...map.values()];
  }, [posts]);

  const categoriesCount = data?.categories?.length ?? new Set(posts.map((p) => p.category)).size;
  const ready = status === "ready";
  const dash = (value) => (ready ? value : "—");

  // "قارئ شهرياً" رقم ثابت حسب التصميم (غير موجود في ملف البيانات)
  const stats = [
    { icon: <FaUsers />, value: <><span dir="ltr">+2</span> مليون</>, label: "قارئ شهرياً", fixed: true },
    { icon: <FaNewspaper />, value: <span dir="ltr">{dash(`${posts.length}+`)}</span>, label: "مقالة منشورة" },
    { icon: <FaPenNib />, value: <span dir="ltr">{dash(`${authors.length}+`)}</span>, label: "كاتب خبير" },
    { icon: <FaBookOpen />, value: <span dir="ltr">{dash(`${categoriesCount}+`)}</span>, label: "تصنيف" },
  ];

  const socialLinks = [
    { href: social.linkedin, label: "لينكدإن", icon: <FaLinkedinIn className="text-xs" /> },
    { href: social.github, label: "جيت هاب", icon: <FaGithub className="text-xs" /> },
    { href: social.twitter, label: "إكس", icon: <XIcon /> },
  ].filter((s) => s.href);

  return (
    <div dir="rtl" className="bg-[#0a0a0a] text-white">
      {/* ================= Hero ================= */}
      <section className="relative overflow-hidden border-b border-white/10">
        <div
          className="pointer-events-none absolute inset-0"
          style={{
            backgroundImage:
              "linear-gradient(rgba(255,255,255,0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.05) 1px, transparent 1px)",
            backgroundSize: "48px 48px",
          }}
        />
        <div className="pointer-events-none absolute -top-24 right-[-10%] h-96 w-96 rounded-full bg-orange-500/10 blur-3xl" />

        <div className="relative mx-auto flex max-w-4xl flex-col items-center px-4 py-16 text-center sm:py-20">
          <span className="mb-6 inline-flex items-center gap-2 rounded-full border border-orange-500/30 bg-orange-500/5 px-4 py-1.5 text-xs text-orange-100">
            <span className="h-1.5 w-1.5 rounded-full bg-orange-500" />
            من نحن
            <span className="h-1.5 w-1.5 rounded-full bg-orange-500" />
          </span>

          <h1 className="text-4xl font-extrabold leading-[1.4] sm:text-5xl">
            مهمتنا هي <span className="text-amber-500">الإعلام والإلهام</span>
          </h1>

          <p className="mt-5 max-w-2xl text-sm leading-8 text-gray-400 sm:text-base">
            {data?.siteInfo?.description ||
              "مدونة متخصصة في فن التصوير الفوتوغرافي. نشارك معكم أسرار المحترفين ونصائح عملية لتطوير مهاراتكم."}{" "}
            نحن شغوفون بمشاركة المعرفة ومساعدة المصورين على تنمية مهاراتهم من خلال محتوى عالي الجودة.
          </p>

          <div className="mt-10 grid w-full max-w-[600px] grid-cols-2 gap-4 sm:grid-cols-4">
            {stats.map((s) => (
              <div
                key={s.label}
                className="flex h-[100px] flex-col items-center justify-center gap-1 rounded-2xl border border-white/10 bg-[#141414]/90"
              >
                <span className="text-lg text-orange-500">{s.icon}</span>
                <span className="text-xl font-extrabold leading-none text-amber-500">{s.value}</span>
                <span className="text-[11px] text-gray-500">{s.label}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ================= قيمنا ================= */}
      <section className="border-b border-white/10 bg-[#111111]">
        <div className="mx-auto max-w-5xl px-4 py-16 text-center sm:py-20">
          <h2 className="inline-flex items-center gap-3 text-2xl font-extrabold sm:text-3xl">
            <span className="h-6 w-1 rounded bg-orange-500" aria-hidden="true" />
            قيمنا
            <span className="h-6 w-1 rounded bg-orange-500" aria-hidden="true" />
          </h2>
          <p className="mt-3 text-sm text-gray-400">المبادئ التي توجه كل ما نقوم بإنشائه</p>

          <ul className="mt-12 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {VALUES.map((v) => (
              <li
                key={v.title}
                className="flex flex-col items-center rounded-2xl border border-white/10 bg-[#161616] px-5 py-7 transition duration-300 hover:border-orange-500/40"
              >
                <span className="text-2xl text-orange-500">{v.icon}</span>
                <h3 className="mt-4 text-sm font-bold">{v.title}</h3>
                <p className="mt-2 text-[11px] leading-6 text-gray-500">{v.text}</p>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* ================= تعرف على كتابنا ================= */}
      <section>
        <div className="mx-auto max-w-5xl px-4 py-16 text-center sm:py-20">
          <span className="inline-flex items-center gap-2 rounded-full border border-orange-500/30 bg-orange-500/5 px-4 py-1.5 text-[11px] font-bold text-orange-400">
            <span className="h-1.5 w-1.5 rounded-full bg-orange-500" />
            فريقنا
          </span>
          <h2 className="mt-5 text-3xl font-extrabold sm:text-4xl">تعرف على كتابنا</h2>
          <p className="mt-3 text-sm text-gray-400">
            فريقنا من المصورين والكتّاب ذوي الخبرة شغوفون بمشاركة معرفتهم مع المجتمع.
          </p>

          {status === "loading" && (
            <p className="py-16 text-gray-400" role="status">
              جاري تحميل الفريق...
            </p>
          )}

          {status === "error" && (
            <div className="mx-auto mt-10 max-w-md rounded-2xl border border-red-500/30 bg-red-500/5 p-8" role="alert">
              <p className="mb-4 text-red-300">تعذّر تحميل البيانات. تأكد من اتصالك وحاول مرة أخرى.</p>
              <button
                type="button"
                onClick={() => setReloadKey((k) => k + 1)}
                className="rounded-full bg-orange-500 px-6 py-2 text-sm font-bold text-white transition hover:bg-orange-600"
              >
                إعادة المحاولة
              </button>
            </div>
          )}

          {ready && (
            <ul className="mt-12 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {authors.map((a) => (
                <li
                  key={a.name}
                  className="flex flex-col items-center rounded-2xl border border-white/10 bg-[#141414] px-5 py-6 transition duration-300 hover:border-orange-500/40"
                >
                  <AuthorAvatar src={a.avatar} name={a.name} />
                  <h3 className="mt-4 text-sm font-bold">{a.name}</h3>
                  {a.role && <p className="mt-1 text-[11px] font-semibold text-orange-500">{a.role}</p>}

                  {socialLinks.length > 0 && (
                    <div className="mt-4 flex items-center gap-2">
                      {socialLinks.map((s) => (
                        <a
                          key={s.label}
                          href={s.href}
                          target="_blank"
                          rel="noopener noreferrer"
                          aria-label={`${s.label} - ${a.name}`}
                          className={socialBtn}
                        >
                          {s.icon}
                        </a>
                      ))}
                    </div>
                  )}
                </li>
              ))}
            </ul>
          )}
        </div>
      </section>

      {/* ================= تواصل معنا ================= */}
      <section className="bg-gradient-to-br from-[#fa4d00] via-[#ff6a00] to-[#f0b000]">
        <div className="mx-auto flex max-w-3xl flex-col items-center px-4 py-14 text-center sm:py-16">
          <h2 className="text-2xl font-extrabold text-white sm:text-3xl">لديك أسئلة؟ دعنا نتحدث!</h2>
          <p className="mt-4 max-w-xl text-sm leading-7 text-white/90">
            نحب أن نسمع منك. سواء كان لديك سؤال حول محتوانا، أو تريد المساهمة، أو تريد فقط إلقاء التحية، لا تتردد في التواصل.
          </p>

          <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
            {email && (
              <a
                href={`mailto:${email}`}
                className="inline-flex items-center gap-2 rounded-xl bg-[#0a0a0a] px-6 py-3 text-xs font-bold text-white transition hover:bg-black hover:scale-105 focus:outline-none focus-visible:ring-2 focus-visible:ring-white"
              >
                <FaRegEnvelope className="text-sm" />
                تواصل معنا
              </a>
            )}
            <Link
              to="/blogs"
              className="inline-flex items-center rounded-xl border border-white/60 px-6 py-3 text-xs font-bold text-white transition hover:bg-white/15 focus:outline-none focus-visible:ring-2 focus-visible:ring-white"
            >
              تصفح المقالات
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}