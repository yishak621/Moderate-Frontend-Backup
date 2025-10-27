import StaticLayout from "@/modules/static/layout/StaticLayout";

export default function PricingPage() {
  return (
    <StaticLayout>
      <div className="py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-4xl font-bold text-gray-900 mb-6">Pricing</h1>
            <p className="text-xl text-gray-600 mb-12">
              Choose the perfect plan for your educational institution.
            </p>
            <div className="h-96 bg-gray-200 rounded-lg flex items-center justify-center">
              <p className="text-gray-500 text-lg">
                Pricing content coming soon...
              </p>
            </div>
          </div>
        </div>
      </div>
    </StaticLayout>
  );
}
