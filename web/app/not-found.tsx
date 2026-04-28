import { Button } from "@/components/ui/Button";
import { Home, MapPinOff } from "lucide-react";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "الصفحة غير موجودة",
  description: "عذراً، الصفحة التي تبحث عنها غير موجودة.",
};

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[70vh] bg-slate-50 px-6 py-24 relative overflow-hidden">
      {/* Decorative Ambient Background Elements */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-teal-50 rounded-full blur-[100px] opacity-70 pointer-events-none" />
      <div className="absolute top-1/4 right-1/4 w-[400px] h-[400px] bg-amber-50 rounded-full blur-[80px] opacity-60 pointer-events-none" />

      <div className="relative z-10 text-center max-w-2xl mx-auto space-y-8 animate-fade-in-up">
        {/* Error Visual */}
        <div className="relative inline-block">
          <div className="text-[150px] md:text-[200px] font-black leading-none text-teal-600/5 select-none tracking-tighter">
            404
          </div>
          <div className="absolute inset-0 flex items-center justify-center pb-4 md:pb-8">
            <div className="w-24 h-24 md:w-32 md:h-32 bg-white rounded-full shadow-2xl shadow-teal-600/20 flex items-center justify-center animate-pulse-glow">
              <MapPinOff className="w-10 h-10 md:w-14 md:h-14 text-amber-500" aria-hidden="true" />
            </div>
          </div>
        </div>

        {/* Text Content */}
        <div className="space-y-4 px-4">
          <h1 className="text-3xl md:text-5xl font-bold text-slate-800 tracking-tight">
            عذراً، الصفحة غير موجودة
          </h1>
          <p className="text-lg text-slate-600 max-w-md mx-auto leading-relaxed">
            يبدو أنك ضللت الطريق. الصفحة التي تحاول الوصول إليها ربما تم نقلها، أو لم تعد متاحة، أو لم تكن موجودة من الأساس.
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-8">
          <Button 
            href="/" 
            variant="primary" 
            size="lg"
            icon={<Home className="w-5 h-5" />}
            iconPosition="end"
          >
            العودة للرئيسية
          </Button>
          <Button 
            href="/contact" 
            variant="ghost" 
            size="lg"
          >
            تواصل معنا للمساعدة
          </Button>
        </div>
      </div>
    </div>
  );
}
