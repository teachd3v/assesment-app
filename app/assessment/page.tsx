import { AssessmentStepper } from "@/components/assessment/AssessmentStepper";

export default function AssessmentPage() {
  return (
    <div className="max-w-2xl mx-auto">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Formulir Asesmen Karyawan</h1>
        <p className="text-gray-500 text-sm mt-1">
          Isi dengan jujur — data ini digunakan untuk mendukung kesejahteraan kerja Anda.
        </p>
      </div>
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 md:p-8">
        <AssessmentStepper />
      </div>
    </div>
  );
}
