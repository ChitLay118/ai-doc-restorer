"use client";
import React, { useState } from 'react';
import { GoogleGenerativeAI } from "@google/generative-ai";
import { jsPDF } from "jspdf";
import { Upload, FileText, Download, Loader2, RefreshCw, AlertCircle } from "lucide-react";

export default function AIDocRestorer() {
  const [image, setImage] = useState<string | null>(null);
  const [restoredText, setRestoredText] = useState("");
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setErrorMsg(null);
      const reader = new FileReader();
      reader.onloadend = () => setImage(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  const processImage = async () => {
    if (!image) return;
    
    const apiKey = process.env.NEXT_PUBLIC_GEMINI_API_KEY;
    
    if (!apiKey) {
      setErrorMsg("API Key မတွေ့ပါ။ Vercel Settings မှာ NEXT_PUBLIC_GEMINI_API_KEY ကို ထည့်ပေးပါ။");
      return;
    }

    setLoading(true);
    setErrorMsg(null);

    try {
      const genAI = new GoogleGenerativeAI(apiKey);
      // ပိုမြန်ပြီး တိကျတဲ့ flash model ကို သုံးထားပါတယ်
      const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
      
      const base64Data = image.split(",")[1];
      
      // မြန်မာစာရော အင်္ဂလိပ်စာပါ သေသေချာချာ ဖတ်နိုင်ဖို့ Prompt ကို ပြင်ထားပါတယ်
      const prompt = "This is a photo of a document that might be damaged, torn, or blurry. 1. Carefully extract all text (including Myanmar Burmese text if present). 2. Fix any spelling errors or missing words caused by damage. 3. Maintain the original layout and paragraph structure. 4. Output ONLY the clean restored text without any explanations.";

      const result = await model.generateContent([
        prompt,
        { inlineData: { data: base64Data, mimeType: "image/jpeg" } },
      ]);
      
      const responseText = result.response.text();
      setRestoredText(responseText);
    } catch (error: any) {
      console.error("AI Error:", error);
      setErrorMsg("AI က ပုံကို ဖတ်လို့မရပါဘူး။ အင်တာနက်လိုင်း သို့မဟုတ် API Key ကို စစ်ဆေးပါ။");
    } finally {
      setLoading(false);
    }
  };

  const exportPDF = () => {
    const doc = new jsPDF();
    // မြန်မာစာအတွက် font configuration လိုအပ်နိုင်ပေမယ့် အခြေခံအားဖြင့် split လုပ်ပြီး ထုတ်ပေးပါမယ်
    const splitText = doc.splitTextToSize(restoredText, 180);
    doc.text(splitText, 15, 20);
    doc.save("restored-document.pdf");
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 p-4 md:p-8 font-sans">
      <div className="max-w-6xl mx-auto">
        <header className="text-center mb-10">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-400 to-emerald-400 bg-clip-text text-transparent">
            AI Document Restorer
          </h1>
          <p className="text-slate-400 mt-2">စုတ်ပြဲနေတဲ့ စာရွက်တွေကို AI နဲ့ အသစ်ပြန်ဖြစ်အောင် လုပ်မယ်</p>
        </header>

        {errorMsg && (
          <div className="mb-6 p-4 bg-red-900/30 border border-red-500/50 rounded-xl flex items-center gap-3 text-red-200">
            <AlertCircle size={20} />
            <p className="text-sm">{errorMsg}</p>
          </div>
        )}

        <div className="grid md:grid-cols-2 gap-8">
          {/* Input Section */}
          <div className="bg-slate-900 p-6 rounded-2xl border border-slate-800 shadow-xl">
            <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
              <Upload size={20} /> စာရွက်ပုံတင်ရန်
            </h2>
            
            <label className="border-2 border-dashed border-slate-700 rounded-xl p-8 flex flex-col items-center justify-center cursor-pointer hover:border-blue-500 transition-colors min-h-[300px]">
              <input type="file" className="hidden" onChange={handleImageUpload} accept="image/*" />
              {image ? (
                <img src={image} alt="Preview" className="max-h-80 rounded-lg shadow-md object-contain" />
              ) : (
                <div className="text-center">
                  <FileText className="mx-auto mb-2 text-slate-500" size={48} />
                  <p className="text-sm text-slate-500">ပုံရွေးရန် နှိပ်ပါ</p>
                </div>
              )}
            </label>

            <button
              onClick={processImage}
              disabled={!image || loading}
              className="w-full mt-6 bg-blue-600 hover:bg-blue-500 disabled:bg-slate-800 py-4 rounded-xl font-bold flex items-center justify-center gap-2 transition-all shadow-lg shadow-blue-900/20"
            >
              {loading ? <Loader2 className="animate-spin" /> : <RefreshCw size={20} />}
              {loading ? "AI က စာဖတ်နေပါတယ်..." : "စတင်ပြုပြင်မည်"}
            </button>
          </div>

          {/* Output Section */}
          <div className="bg-slate-900 p-6 rounded-2xl border border-slate-800 shadow-xl flex flex-col">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold flex items-center gap-2">
                <FileText size={20} /> A4 Preview
              </h2>
              {restoredText && (
                <button
                  onClick={exportPDF}
                  className="bg-emerald-600 hover:bg-emerald-500 p-2 px-4 rounded-lg flex items-center gap-2 text-sm transition-all"
                >
                  <Download size={16} /> PDF သိမ်းမည်
                </button>
              )}
            </div>

            <div className="flex-1 bg-white text-black p-8 rounded-lg shadow-inner overflow-y-auto min-h-[400px] leading-relaxed whitespace-pre-wrap font-serif border-[12px] border-slate-800">
              {restoredText || (
                <div className="h-full flex items-center justify-center text-slate-300 italic text-center">
                  ပြုပြင်ပြီးသား စာသားတွေကို <br/> ဒီမှာ A4 စာရွက်ပုံစံနဲ့ မြင်ရပါမယ်
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
