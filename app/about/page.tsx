"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { useNavigation } from "../hooks/useNavigation";
import { ArrowLeft, BookOpen, FileText, Users, Zap } from "lucide-react";

const AboutPage = () => {
  const { navigateBack } = useNavigation();
  return (
    <div className="min-h-screen bg-theme-bg transition-theme">
      {/* Header */}
      <div className="border-b border-theme-border">
        <div className="max-w-full mx-auto px-4 sm:px-6 py-4">
          <div className="flex items-center justify-between">
            <button 
              onClick={navigateBack}
              className="flex items-center space-x-2 text-theme-text-muted hover:text-theme-text transition-colors min-w-[44px] min-h-[44px] flex-shrink-0"
              aria-label="ត្រលប់ទៅការសន្ទនា"
            >
              <ArrowLeft className="w-4 h-4" />
              <span className="text-sm hidden sm:inline">ត្រលប់ទៅការសន្ទនា</span>
            </button>
            
            <div className="flex items-center space-x-2">
              <div className="w-6 h-6 bg-theme-accent rounded flex items-center justify-center flex-shrink-0">
                <Image
                  src="/weteka-logo.png"
                  width={16}
                  height={16}
                  alt="weteka-logo"
                  className="w-4 h-4 invert"
                />
              </div>
              <span className="text-sm font-medium text-theme-text">Weteka AI</span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto px-6 py-12">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <div className="w-16 h-16 bg-blue-600 rounded-lg mx-auto mb-6 flex items-center justify-center">
            <Image
              src="/weteka-logo.png"
              width={32}
              height={32}
              alt="weteka-logo"
              className="w-8 h-8 invert"
            />
          </div>
          
          <h1 className="text-3xl font-semibold text-gray-900 mb-4">
            Weteka AI ជំនួយការ
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto leading-relaxed">
            ជំនួយការអប់រំ និងកិច្ចការរដ្ឋបាលដ៏ទូលំទូលាយ ដែលបានរចនាឡើងពិសេសសម្រាប់អ្នកប្រើប្រាស់ខ្មែរ
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
          <div className="border border-gray-200 rounded-lg p-6">
            <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center mb-4">
              <BookOpen className="w-5 h-5 text-gray-600" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-3">ការអប់រំ</h3>
            <p className="text-gray-600 leading-relaxed text-sm">
              ពន្យល់មុខវិជ្ជាគ្រប់ប្រភេទ ដោះស្រាយលំហាត់ និងបង្រៀនគំនិតស្មុគស្មាញឱ្យងាយយល់
            </p>
          </div>

          <div className="border border-gray-200 rounded-lg p-6">
            <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center mb-4">
              <FileText className="w-5 h-5 text-gray-600" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-3">ការសរសេរឯកសារ</h3>
            <p className="text-gray-600 leading-relaxed text-sm">
              សំបុត្រផ្លូវការ របាយការណ៍ប្រចាំខែ និងឯកសារអាជីវកម្មគ្រប់ប្រភេទ
            </p>
          </div>

          <div className="border border-gray-200 rounded-lg p-6">
            <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center mb-4">
              <Users className="w-5 h-5 text-gray-600" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-3">កិច្ចការរដ្ឋបាល</h3>
            <p className="text-gray-600 leading-relaxed text-sm">
              ឯកសារច្បាប់ សំណើរស្នើសុំ និងការណែនាំវិជ្ជាជីវៈ
            </p>
          </div>

          <div className="border border-gray-200 rounded-lg p-6">
            <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center mb-4">
              <Zap className="w-5 h-5 text-gray-600" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-3">បច្ចេកទេស</h3>
            <p className="text-gray-600 leading-relaxed text-sm">
              ការសរសេរកម្មវិធី ការអភិវឌ្ឍន៍ និងការដោះស្រាយបញ្ហាបច្ចេកទេស
            </p>
          </div>
        </div>

        {/* About Section */}
        <div className="border border-gray-200 rounded-lg p-8 mb-12">
          <h2 className="text-2xl font-semibold text-gray-900 mb-6 text-center">
            អំពី Weteka AI
          </h2>
          <div className="space-y-4 text-gray-600 leading-relaxed">
            <p>
              Weteka AI ជំនួយការ គឺជាប្រព័ន្ធ AI ដែលបានអភិវឌ្ឍឡើងដោយបច្ចេកវិទ្យា Claude 3.5 Sonnet 
              ដែលមានការយល់ដឹងជ្រៅជ្រះអំពីភាសា វប្បធម៌ និងទំនៀមទំលាប់កម្ពុជា។
            </p>
            <p>
              យើងបានរចនា Weteka AI ឱ្យក្លាយជាដៃគូដ៏ទុកចិត្តបានសម្រាប់សិស្ស អ្នកជំនាញ និងអ្នកប្រើប្រាស់ទូទៅ 
              ក្នុងការជួយដោះស្រាយបញ្ហា រៀនសូត្រ និងបង្កើនប្រសិទ្ធភាពការងារ។
            </p>
            <p>
              ជាមួយនឹងការផ្តោតលើភាសាខ្មែរជាចម្បង Weteka AI អាចយល់ និងឆ្លើយតបបានយ៉ាងសមស្រប 
              ទាំងក្នុងបរិបទអប់រំ អាជីវកម្ម និងជីវិតប្រចាំថ្ងៃ។
            </p>
          </div>
        </div>

        {/* CTA Section */}
        <div className="text-center">
          <button
            onClick={navigateBack}
            className="inline-flex items-center space-x-2 bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium transition-colors"
          >
            <span>ចាប់ផ្តើមការសន្ទនា</span>
            <ArrowLeft className="w-4 h-4 rotate-180" />
          </button>
        </div>
      </div>

      {/* Footer */}
      <div className="border-t border-gray-200">
        <div className="max-w-4xl mx-auto px-6 py-6">
          <div className="text-center text-sm text-gray-500">
            <p>© 2024 Weteka AI ជំនួយការ - រចនាឡើងសម្រាប់កម្ពុជា</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AboutPage;