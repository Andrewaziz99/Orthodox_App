"use client";

import React, { useState } from 'react';
import { PageHero } from "@/components/ui/PageHero";
import { useLang } from "@/components/providers/LanguageProvider";
import { Button, Input } from "@/components/ui";
import { Mail, Phone, MapPin, Send, Clock, Loader2 } from 'lucide-react';
import { toast } from "@/components/ui/Toast";

export default function ContactPage() {
  const { t, locale } = useLang();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    church: '',
    message: ''
  });

  const breadcrumbs = [
    { label: t('nav.home'), href: '/' },
    { label: t('nav.contact'), href: '/contact' }
  ];

  const contactInfo = [
    {
      icon: MapPin,
      title: locale === 'ar' ? 'العنوان' : 'Address',
      detail: locale === 'ar' ? '١٢٣ شارع، القاهرة، مصر' : '123 Street, Cairo, Egypt',
      color: 'teal',
    },
    {
      icon: Phone,
      title: locale === 'ar' ? 'الهاتف' : 'Phone',
      detail: '+20 123 456 7890',
      color: 'amber',
    },
    {
      icon: Mail,
      title: locale === 'ar' ? 'البريد الإلكتروني' : 'Email',
      detail: 'contact@example.com',
      color: 'teal',
    },
    {
      icon: Clock,
      title: locale === 'ar' ? 'أوقات العمل' : 'Working Hours',
      detail: locale === 'ar' ? 'الأحد - الخميس: ٩ ص - ٥ م' : 'Sun - Thu: 9 AM - 5 PM',
      color: 'amber',
    },
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Basic Validation
    if (!formData.name.trim() || !formData.email.trim() || !formData.message.trim()) {
      toast.error(locale === 'ar' ? 'يرجى ملء جميع الحقول المطلوبة' : 'Please fill all required fields');
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      toast.error(locale === 'ar' ? 'البريد الإلكتروني غير صحيح' : 'Invalid email address');
      return;
    }

    setIsSubmitting(true);

    // Simulate API call
    try {
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      toast.success(locale === 'ar' ? 'تم إرسال رسالتك بنجاح!' : 'Your message has been sent successfully!');
      setFormData({ name: '', email: '', church: '', message: '' });
    } catch (error) {
      toast.error(locale === 'ar' ? 'حدث خطأ أثناء الإرسال. حاول مرة أخرى.' : 'Error sending message. Try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <PageHero 
        title={t('nav.contact')} 
        subtitle={locale === 'ar' ? 'يسعدنا تواصلكم معنا' : 'We would love to hear from you'}
        breadcrumbs={breadcrumbs} 
      />

      <section className="py-20 md:py-28 bg-white relative overflow-hidden">
        {/* Decorative blurs */}
        <div className="absolute top-0 end-0 w-[35rem] h-[35rem] bg-teal-50/40 rounded-full blur-[120px]" />
        <div className="absolute bottom-0 start-0 w-[25rem] h-[25rem] bg-amber-50/30 rounded-full blur-[100px]" />

        <div className="container-max relative z-10">
          <div className="grid lg:grid-cols-5 gap-12 lg:gap-16">
            
            {/* Contact Info - Left side */}
            <div className="lg:col-span-2 space-y-6">
              <div className="mb-10">
                <span className="inline-block text-xs font-black text-teal-600 uppercase tracking-[0.3em] mb-4">
                  {locale === 'ar' ? 'معلومات التواصل' : 'Contact Info'}
                </span>
                <h2 className="text-3xl font-black text-slate-900 mb-4 leading-tight">
                  {locale === 'ar' ? 'تواصل معنا' : 'Get In Touch'}
                </h2>
                <p className="text-slate-600 leading-relaxed">
                  {locale === 'ar' 
                    ? 'لا تتردد في التواصل معنا بخصوص أي استفسار عن مناهجنا أو منصتنا الرقمية.'
                    : 'Do not hesitate to contact us about any inquiries regarding our curricula or digital platform.'}
                </p>
              </div>

              <div className="space-y-4">
                {contactInfo.map((info, idx) => {
                  const Icon = info.icon;
                  const isTeal = info.color === 'teal';
                  return (
                    <div 
                      key={idx}
                      className="group flex items-start gap-4 p-5 rounded-2xl bg-slate-50/60 border border-slate-100 hover:bg-white hover:shadow-md hover:border-slate-200 transition-all duration-300"
                    >
                      <div className={`w-11 h-11 rounded-xl flex items-center justify-center shrink-0 ${isTeal ? 'bg-teal-50 text-teal-600 border border-teal-100' : 'bg-amber-50 text-amber-600 border border-amber-100'}`}>
                        <Icon className="w-5 h-5" />
                      </div>
                      <div>
                        <h4 className="font-bold text-slate-900 text-sm mb-1">{info.title}</h4>
                        <p className="text-slate-600 text-sm">{info.detail}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
            
            {/* Contact Form - Right side */}
            <div className="lg:col-span-3">
              <div className="bg-white rounded-3xl p-8 md:p-12 border border-slate-100 shadow-xl shadow-slate-200/50">
                {/* Form header */}
                <div className="flex items-center gap-3 mb-10">
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-teal-500 to-teal-600 flex items-center justify-center shadow-md shadow-teal-500/20">
                    <Send className="w-5 h-5 text-white" />
                  </div>
                  <h3 className="text-2xl font-black text-slate-900">
                    {locale === 'ar' ? 'أرسل رسالة' : 'Send a Message'}
                  </h3>
                </div>

                <form className="space-y-6" onSubmit={handleSubmit}>
                  <div className="grid md:grid-cols-2 gap-6">
                    <Input 
                      label={locale === 'ar' ? 'الاسم الكامل' : 'Full Name'} 
                      value={formData.name}
                      onChange={(e) => setFormData({...formData, name: e.target.value})}
                      placeholder={locale === 'ar' ? 'يوحنا مرقص' : 'John Mark'} 
                      required 
                    />
                    <Input 
                      label={locale === 'ar' ? 'البريد الإلكتروني' : 'Email Address'} 
                      type="email" 
                      value={formData.email}
                      onChange={(e) => setFormData({...formData, email: e.target.value})}
                      placeholder="john@example.com" 
                      required 
                    />
                  </div>
                  <Input 
                    label={locale === 'ar' ? 'اسم الكنيسة' : 'Church Name'} 
                    value={formData.church}
                    onChange={(e) => setFormData({...formData, church: e.target.value})}
                    placeholder={locale === 'ar' ? 'كنيسة مارمرقس القبطية الأرثوذكسية' : 'St. Mark Coptic Orthodox Church'} 
                  />
                  
                  <div className="flex flex-col gap-2.5">
                    <label className="text-sm font-bold text-slate-700">
                      {locale === 'ar' ? 'الرسالة' : 'Message'}
                    </label>
                    <textarea 
                      className="w-full bg-slate-50 border-2 border-slate-200 rounded-2xl px-5 py-4 min-h-[160px] text-slate-800 focus:outline-none focus:border-teal-500 focus:bg-white transition-all duration-300 resize-y placeholder:text-slate-400" 
                      value={formData.message}
                      onChange={(e) => setFormData({...formData, message: e.target.value})}
                      placeholder={locale === 'ar' ? 'كيف يمكننا مساعدتك؟' : 'How can we help you?'}
                      required
                    />
                  </div>
                  
                  <Button 
                    type="submit" 
                    variant="primary" 
                    size="lg" 
                    disabled={isSubmitting}
                    className="w-full md:w-auto px-12 py-4 rounded-xl bg-gradient-to-r from-teal-500 to-teal-600 hover:from-teal-600 hover:to-teal-700 shadow-lg shadow-teal-500/20 hover:shadow-teal-500/30 transition-all duration-300 disabled:opacity-70 disabled:cursor-not-allowed"
                  >
                    <span className="flex items-center justify-center gap-2">
                      {isSubmitting ? (
                        <>
                          <Loader2 className="w-4 h-4 animate-spin" />
                          {locale === 'ar' ? 'جاري الإرسال...' : 'Sending...'}
                        </>
                      ) : (
                        <>
                          <Send className="w-4 h-4" />
                          {locale === 'ar' ? 'إرسال الرسالة' : 'Send Message'}
                        </>
                      )}
                    </span>
                  </Button>
                </form>
              </div>
            </div>
            
          </div>
        </div>
      </section>
    </>
  );
}
