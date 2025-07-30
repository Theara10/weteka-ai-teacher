"use client";

import React, { useState } from "react";
import { HelpCircle, X } from "lucide-react";

interface HelpMenuProps {
  isVisible?: boolean;
}

const HelpMenu: React.FC<HelpMenuProps> = ({ isVisible = true }) => {
  const [isOpen, setIsOpen] = useState(false);

  const helpItems = [
    {
      title: "សួរសំណួរអប់រំ",
      description: "ពន្យល់មុខវិជ្ជាគ្រប់ប្រភេទ ដោះស្រាយលំហាត់ និងបង្រៀនគំនិតស្មុគស្មាញ",
      examples: [
        "ពន្យល់ខ្ញុំអំពីប្រភេទត្រីកោណ និងរបៀបគណនាបរិមាត្រ",
        "ដោះស្រាយសមីការ x² + 5x + 6 = 0",
        "ពន្យល់ដំណើរការរស្មីសំយោគ",
        "តើមនុស្សជាតិមកពីណា?"
      ]
    },
    {
      title: "សរសេរឯកសារផ្លូវការ",
      description: "ជួយសរសេរសំបុត្រ របាយការណ៍ និងឯកសារអាជីវកម្មគ្រប់ប្រភេទ",
      examples: [
        "ជួយខ្ញុំសរសេរសំបុត្រស្នើសុំការងារមុខតំណែងគ្រូបង្រៀនគណិតវិទ្យា",
        "សរសេររបាយការណ៍ប្រចាំខែសម្រាប់ក្រុមហ៊ុនលក់ទំនិញ",
        "បង្កើតសំណើរស្នើសុំឈប់សម្រាកមាតុភាព",
        "ជួយសរសេរកិច្ចព្រមព្រៀងការងារ"
      ]
    },
    {
      title: "កិច្ចការរដ្ឋបាល",
      description: "ឯកសារច្បាប់ សំណើរស្នើសុំ និងទម្រង់រដ្ឋាភិបាល",
      examples: [
        "ជួយខ្ញុំបំពេញទម្រង់ស្នើសុំលិខិតឆ្លងដែន",
        "សរសេរសំណើរស្នើសុំប័ណ្ណអត្តសញ្ញាណ",
        "បង្កើតលិខិតបញ្ជាក់ការងារ",
        "ជួយសរសេរសំណើរស្នើសុំអាជ្ញាប័ណ្ណធ្វើអាជីវកម្ម"
      ]
    },
    {
      title: "បកប្រែ និងកែលម្អភាសា",
      description: "បកប្រែភាសាខ្មែរ-អង់គ្លេស និងកែតម្រូវការសរសេរ",
      examples: [
        "បកប្រែឃ្លានេះជាភាសាអង់គ្លេស: 'ខ្ញុំចង់រៀនភាសាអង់គ្លេស'",
        "កែតម្រូវវេយ្យាករណ៍នៃប្រយោគនេះ",
        "ពន្យល់ពាក្យស្មុគស្មាញនេះឱ្យងាយយល់",
        "ជួយកែសម្រួលអត្ថបទនេះឱ្យកាន់តែល្អ"
      ]
    },
    {
      title: "ការសរសេរកម្មវិធី",
      description: "ជំនួយបច្ចេកទេស ការសរសេរកូដ និងការដោះស្រាយបញ្ហា IT",
      examples: [
        "ជួយខ្ញុំសរសេរកម្មវិធី Python គណនាលេខកូដ",
        "ពន្យល់របៀបប្រើ HTML និង CSS",
        "ដោះស្រាយបញ្ហា Error នៅក្នុងកូដនេះ",
        "រចនាទិន្នន័យមូលដ្ឋានសម្រាប់ហាងលក់កាហ្វេ"
      ]
    },
    {
      title: "ការរៀនសូត្រ និងស្រាវជ្រាវ",
      description: "ស្វែងយល់ព័ត៌មាន ការវិភាគ និងការស្រាវជ្រាវលម្អិត",
      examples: [
        "ប្រាប់ខ្ញុំអំពីប្រវត្តិសាស្រ្តអង្គរ និងសេដ្ឋកិច្ចសម័យនោះ",
        "ពន្យល់អំពីបញ្ហាប្រែប្រួលអាកាសធាតុ និងផលប៉ះពាល់",
        "វិភាគគុណវិបត្តិ និងគុណសម្បត្តិនៃបច្ចេកវិទ្យាសម័យថ្មី",
        "ស្វែងយល់អំពីសេដ្ឋកិច្ចកម្ពុជាបច្ចុប្បន្ន"
      ]
    }
  ];

  if (!isVisible) return null;

  return (
    <>
      {/* Help Button */}
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-20 right-4 z-50 w-12 h-12 bg-theme-accent hover:bg-theme-accent-hover text-white rounded-full shadow-lg hover:shadow-xl transition-all duration-200 flex items-center justify-center"
        title="How to use"
      >
        <HelpCircle className="w-5 h-5" />
      </button>

      {/* Help Modal */}
      {isOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 dark:bg-opacity-70 flex items-center justify-center z-50 p-4">
          <div className="bg-theme-bg border border-theme-border rounded-2xl max-w-md w-full max-h-[80vh] overflow-y-auto">
            {/* Header */}
            <div className="sticky top-0 bg-theme-bg border-b border-theme-border-light px-6 py-4 rounded-t-2xl">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-bold text-theme-text">
                  របៀបប្រើប្រាស់ Weteka AI
                </h2>
                <button
                  onClick={() => setIsOpen(false)}
                  className="p-1 hover:bg-theme-bg-secondary rounded-full transition-colors"
                >
                  <X className="w-5 h-5 text-theme-text-muted" />
                </button>
              </div>
            </div>

            {/* Content */}
            <div className="p-6 space-y-6">
              <div className="text-center mb-6">
                <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full mx-auto mb-4 flex items-center justify-center">
                  <span className="text-2xl text-white">🤖</span>
                </div>
                <p className="text-theme-text-secondary text-sm leading-relaxed">
                  Weteka AI ជំនួយការ អាចជួយអ្នកក្នុងការរៀន ការងារ និងកិច្ចការផ្សេងៗជាច្រើន
                </p>
              </div>

              {/* Help Items */}
              <div className="space-y-4">
                {helpItems.map((item, index) => (
                  <div
                    key={index}
                    className="bg-theme-bg-secondary rounded-xl p-4 border border-theme-border-light"
                  >
                    <h3 className="font-semibold text-theme-text mb-2 text-sm">
                      {item.title}
                    </h3>
                    <p className="text-theme-text-secondary text-xs mb-3 leading-relaxed">
                      {item.description}
                    </p>
                    <div className="bg-theme-bg border border-theme-border rounded-lg p-3 space-y-2">
                      <div className="text-xs font-medium text-theme-text-secondary mb-2">ឧទាហរណ៍:</div>
                      {item.examples.map((example, idx) => (
                        <div key={idx} className="text-xs text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/20 p-2 rounded border-l-2 border-blue-200 dark:border-blue-800">
                          &ldquo;{example}&rdquo;
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>

              {/* Best Practices */}
              <div className="bg-green-50 border border-green-200 rounded-xl p-4">
                <h3 className="font-semibold text-green-900 mb-3 text-sm">
                  🎯 របៀបទទួលបានលទ្ធផលល្អបំផុត
                </h3>
                <div className="space-y-3">
                  <div className="bg-white rounded-lg p-3 border border-green-100">
                    <h4 className="font-medium text-green-800 text-xs mb-1">១. សួរសំណួរច្បាស់លាស់</h4>
                    <p className="text-xs text-green-700 mb-2">ផ្តល់ព័ត៌មានលម្អិត និងបរិបទច្បាស់លាស់</p>
                    <div className="space-y-1 text-xs">
                      <div className="bg-red-50 p-2 rounded border-l-2 border-red-200">
                        <span className="text-red-600 font-medium">❌ មិនល្អ:</span> <span className="text-gray-700">&ldquo;ជួយខ្ញុំសរសេរ&rdquo;</span>
                      </div>
                      <div className="bg-green-50 p-2 rounded border-l-2 border-green-200">
                        <span className="text-green-600 font-medium">✅ ល្អ:</span> <span className="text-gray-700">&ldquo;ជួយខ្ញុំសរសេរសំបុត្រស្នើសុំការងារមុខតំណែងគ្រូបង្រៀនគណិតវិទ្យា&rdquo;</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="bg-white rounded-lg p-3 border border-green-100">
                    <h4 className="font-medium text-green-800 text-xs mb-1">២. ផ្តល់បរិបទ និងឧទាហរណ៍</h4>
                    <p className="text-xs text-green-700">បញ្ជាក់អំពីគោលដៅ ក្រុមទាំងគន្លង និងតម្រូវការពិសេស</p>
                    <div className="mt-2 text-xs">
                      <span className="text-green-600">✅ ឧទាហរណ៍:</span> <span className="text-gray-600">&ldquo;សរសេរសំបុត្រផ្លូវការជូនដល់ក្រសួងអប់រំ ស្នើសុំការឯកភាពកែតម្រូវកម្មវិធីសិក្សា សម្រាប់សាលាបឋមសិក្សា&rdquo;</span>
                    </div>
                  </div>

                  <div className="bg-white rounded-lg p-3 border border-green-100">
                    <h4 className="font-medium text-green-800 text-xs mb-1">៣. បែងចែកសំណួរធំជាសំណួរតូច</h4>
                    <p className="text-xs text-green-700">សួរមួយបញ្ហាក្នុងមួយពេល ដើម្បីទទួលបានចម្លើយលម្អិត</p>
                  </div>

                  <div className="bg-white rounded-lg p-3 border border-green-100">
                    <h4 className="font-medium text-green-800 text-xs mb-1">៤. ប្រើភាសាខ្មែរជាចម្បង</h4>
                    <p className="text-xs text-green-700">Weteka AI យល់ភាសាខ្មែរបានល្អ និងអាចផ្តល់ចម្លើយសមស្រប</p>
                  </div>

                  <div className="bg-white rounded-lg p-3 border border-green-100">
                    <h4 className="font-medium text-green-800 text-xs mb-1">៥. សួរសំណួរបន្ថែម</h4>
                    <p className="text-xs text-green-700">កុំស្ទាក់ស្ទើរសួរសំណួរបន្ថែម ឬស្នើសុំការពន្យល់បន្ថែម</p>
                  </div>
                </div>
              </div>

              {/* Tips */}
              <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
                <h3 className="font-semibold text-blue-900 mb-2 text-sm">
                  ជំនួយបន្ថែម
                </h3>
                <ul className="text-xs text-blue-700 space-y-1">
                  <li>• ចុច Enter ដើម្បីផ្ញើសាររបស់អ្នក</li>
                  <li>• ចុច Shift+Enter ដើម្បីបន្តបន្ទាត់ថ្មី</li>
                  <li>• អ្នកអាចកែសម្រួលចម្លើយរបស់ AI បាន</li>
                  <li>• ចុចលើប្រអប់ចម្លើយដើម្បីចម្លង ឬចែករំលែក</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default HelpMenu;