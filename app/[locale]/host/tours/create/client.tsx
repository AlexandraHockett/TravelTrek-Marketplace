// ===================================================================
// 📁 app/[locale]/host/tours/create/client.tsx
// Location: CREATE this file in app/[locale]/host/tours/create/client.tsx
// ===================================================================

"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useTranslations } from "@/lib/i18n";
import {
  MapPin,
  Clock,
  Users,
  Camera,
  Plus,
  Minus,
  ChevronLeft,
  Save,
  Eye,
  Upload,
  X,
} from "lucide-react";

interface CreateTourClientProps {
  locale: string;
}

interface TourFormData {
  title: string;
  description: string;
  location: string;
  duration: number;
  maxParticipants: number;
  price: number;
  difficulty: "easy" | "moderate" | "challenging";
  language: string;
  included: string[];
  excluded: string[];
  requirements: string[];
  cancellationPolicy: string;
  images: string[];
  category: string;
  highlights: string[];
}

const DIFFICULTIES = ["easy", "moderate", "challenging"] as const;
const LANGUAGES = ["Português", "English", "Español", "Français", "Deutsch"];
const CATEGORIES = [
  "cultural",
  "adventure",
  "nature",
  "historical",
  "food",
  "art",
  "sports",
  "relaxation",
];

export default function CreateTourClient({ locale }: CreateTourClientProps) {
  const t = useTranslations(locale);
  const router = useRouter();

  const [formData, setFormData] = useState<TourFormData>({
    title: "",
    description: "",
    location: "",
    duration: 3,
    maxParticipants: 10,
    price: 50,
    difficulty: "moderate",
    language: "Português",
    included: [""],
    excluded: [""],
    requirements: [""],
    cancellationPolicy: "",
    images: [],
    category: "cultural",
    highlights: [""],
  });

  const [currentStep, setCurrentStep] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<
    Partial<Record<keyof TourFormData, string>>
  >({});

  const updateFormData = (field: keyof TourFormData, value: any) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));

    // Clear error when field is updated
    if (errors[field]) {
      setErrors((prev) => ({
        ...prev,
        [field]: undefined,
      }));
    }
  };

  const addArrayItem = (field: keyof TourFormData) => {
    const currentArray = formData[field] as string[];
    updateFormData(field, [...currentArray, ""]);
  };

  const removeArrayItem = (field: keyof TourFormData, index: number) => {
    const currentArray = formData[field] as string[];
    updateFormData(
      field,
      currentArray.filter((_, i) => i !== index)
    );
  };

  const updateArrayItem = (
    field: keyof TourFormData,
    index: number,
    value: string
  ) => {
    const currentArray = formData[field] as string[];
    const newArray = [...currentArray];
    newArray[index] = value;
    updateFormData(field, newArray);
  };

  const validateStep = (step: number): boolean => {
    const newErrors: Partial<Record<keyof TourFormData, string>> = {};

    switch (step) {
      case 1:
        if (!formData.title.trim()) {
          newErrors.title = t(
            "host.tours.create.errors.titleRequired",
            "Title is required"
          );
        }
        if (!formData.description.trim()) {
          newErrors.description = t(
            "host.tours.create.errors.descriptionRequired",
            "Description is required"
          );
        }
        if (!formData.location.trim()) {
          newErrors.location = t(
            "host.tours.create.errors.locationRequired",
            "Location is required"
          );
        }
        break;
      case 2:
        if (formData.duration < 1) {
          newErrors.duration = t(
            "host.tours.create.errors.durationMin",
            "Duration must be at least 1 hour"
          );
        }
        if (formData.maxParticipants < 1) {
          newErrors.maxParticipants = t(
            "host.tours.create.errors.participantsMin",
            "Must allow at least 1 participant"
          );
        }
        if (formData.price < 1) {
          newErrors.price = t(
            "host.tours.create.errors.priceMin",
            "Price must be at least €1"
          );
        }
        break;
      case 3:
        // Validate arrays have at least one non-empty item
        const filteredIncluded = formData.included.filter((item) =>
          item.trim()
        );
        if (filteredIncluded.length === 0) {
          newErrors.included = t(
            "host.tours.create.errors.includedRequired",
            "At least one included item is required"
          ) as any;
        }
        break;
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (validateStep(currentStep)) {
      setCurrentStep((prev) => Math.min(prev + 1, 4));
    }
  };

  const handlePrevious = () => {
    setCurrentStep((prev) => Math.max(prev - 1, 1));
  };

  const handleSubmit = async () => {
    if (!validateStep(currentStep)) return;

    setIsLoading(true);
    try {
      // Clean arrays (remove empty strings)
      const cleanedData = {
        ...formData,
        included: formData.included.filter((item) => item.trim()),
        excluded: formData.excluded.filter((item) => item.trim()),
        requirements: formData.requirements.filter((item) => item.trim()),
        highlights: formData.highlights.filter((item) => item.trim()),
      };

      const response = await fetch("/api/tours", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(cleanedData),
      });

      if (!response.ok) {
        throw new Error("Failed to create tour");
      }

      const result = await response.json();

      // Redirect to the new tour or tours list
      router.push(`/${locale}/host/tours/${result.id}`);
    } catch (error) {
      console.error("Error creating tour:", error);
      // Handle error (show toast, etc.)
    } finally {
      setIsLoading(false);
    }
  };

  const renderStep1 = () => (
    <div className="space-y-6">
      <h2 className="text-2xl font-semibold text-gray-900 mb-6">
        {t("host.tours.create.steps.basicInfo", "Basic Information")}
      </h2>

      {/* Title */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          {t("host.tours.create.form.title", "Tour Title")} *
        </label>
        <input
          type="text"
          value={formData.title}
          onChange={(e) => updateFormData("title", e.target.value)}
          className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
            errors.title ? "border-red-500" : "border-gray-300"
          }`}
          placeholder={t(
            "host.tours.create.placeholders.title",
            "e.g., Historic Lisbon Walking Tour"
          )}
        />
        {errors.title && (
          <p className="mt-1 text-sm text-red-600">{errors.title}</p>
        )}
      </div>

      {/* Location */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          <MapPin className="inline w-4 h-4 mr-1" />
          {t("host.tours.create.form.location", "Location")} *
        </label>
        <input
          type="text"
          value={formData.location}
          onChange={(e) => updateFormData("location", e.target.value)}
          className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
            errors.location ? "border-red-500" : "border-gray-300"
          }`}
          placeholder={t(
            "host.tours.create.placeholders.location",
            "e.g., Lisbon, Portugal"
          )}
        />
        {errors.location && (
          <p className="mt-1 text-sm text-red-600">{errors.location}</p>
        )}
      </div>

      {/* Category */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          {t("host.tours.create.form.category", "Category")}
        </label>
        <select
          value={formData.category}
          onChange={(e) => updateFormData("category", e.target.value)}
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        >
          {CATEGORIES.map((category) => (
            <option key={category} value={category}>
              {t(`tours.categories.${category}`, category)}
            </option>
          ))}
        </select>
      </div>

      {/* Description */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          {t("host.tours.create.form.description", "Description")} *
        </label>
        <textarea
          value={formData.description}
          onChange={(e) => updateFormData("description", e.target.value)}
          rows={6}
          className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
            errors.description ? "border-red-500" : "border-gray-300"
          }`}
          placeholder={t(
            "host.tours.create.placeholders.description",
            "Describe your tour experience, what makes it special, and what guests can expect..."
          )}
        />
        {errors.description && (
          <p className="mt-1 text-sm text-red-600">{errors.description}</p>
        )}
      </div>
    </div>
  );

  const renderStep2 = () => (
    <div className="space-y-6">
      <h2 className="text-2xl font-semibold text-gray-900 mb-6">
        {t("host.tours.create.steps.details", "Tour Details")}
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Duration */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            <Clock className="inline w-4 h-4 mr-1" />
            {t("host.tours.create.form.duration", "Duration (hours)")} *
          </label>
          <input
            type="number"
            min="1"
            max="24"
            step="0.5"
            value={formData.duration}
            onChange={(e) =>
              updateFormData("duration", parseFloat(e.target.value))
            }
            className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
              errors.duration ? "border-red-500" : "border-gray-300"
            }`}
          />
          {errors.duration && (
            <p className="mt-1 text-sm text-red-600">{errors.duration}</p>
          )}
        </div>

        {/* Max Participants */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            <Users className="inline w-4 h-4 mr-1" />
            {t("host.tours.create.form.maxParticipants", "Max Participants")} *
          </label>
          <input
            type="number"
            min="1"
            max="50"
            value={formData.maxParticipants}
            onChange={(e) =>
              updateFormData("maxParticipants", parseInt(e.target.value))
            }
            className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
              errors.maxParticipants ? "border-red-500" : "border-gray-300"
            }`}
          />
          {errors.maxParticipants && (
            <p className="mt-1 text-sm text-red-600">
              {errors.maxParticipants}
            </p>
          )}
        </div>

        {/* Price */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            {t("host.tours.create.form.price", "Price per Person (€)")} *
          </label>
          <input
            type="number"
            min="1"
            step="1"
            value={formData.price}
            onChange={(e) => updateFormData("price", parseInt(e.target.value))}
            className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
              errors.price ? "border-red-500" : "border-gray-300"
            }`}
          />
          {errors.price && (
            <p className="mt-1 text-sm text-red-600">{errors.price}</p>
          )}
        </div>

        {/* Difficulty */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            {t("host.tours.create.form.difficulty", "Difficulty Level")}
          </label>
          <select
            value={formData.difficulty}
            onChange={(e) => updateFormData("difficulty", e.target.value)}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            {DIFFICULTIES.map((difficulty) => (
              <option key={difficulty} value={difficulty}>
                {t(`tours.${difficulty}`, difficulty)}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Language */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          {t("host.tours.create.form.language", "Tour Language")}
        </label>
        <select
          value={formData.language}
          onChange={(e) => updateFormData("language", e.target.value)}
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        >
          {LANGUAGES.map((language) => (
            <option key={language} value={language}>
              {language}
            </option>
          ))}
        </select>
      </div>
    </div>
  );

  const renderStep3 = () => (
    <div className="space-y-6">
      <h2 className="text-2xl font-semibold text-gray-900 mb-6">
        {t("host.tours.create.steps.features", "Features & Requirements")}
      </h2>

      {/* Included */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          {t("host.tours.create.form.included", "What's Included")} *
        </label>
        <div className="space-y-2">
          {formData.included.map((item, index) => (
            <div key={index} className="flex gap-2">
              <input
                type="text"
                value={item}
                onChange={(e) =>
                  updateArrayItem("included", index, e.target.value)
                }
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder={t(
                  "host.tours.create.placeholders.included",
                  "e.g., Professional guide"
                )}
              />
              {formData.included.length > 1 && (
                <button
                  type="button"
                  onClick={() => removeArrayItem("included", index)}
                  className="p-2 text-red-600 hover:bg-red-50 rounded-lg"
                >
                  <Minus className="w-4 h-4" />
                </button>
              )}
            </div>
          ))}
          <button
            type="button"
            onClick={() => addArrayItem("included")}
            className="flex items-center gap-2 px-4 py-2 text-blue-600 hover:bg-blue-50 rounded-lg"
          >
            <Plus className="w-4 h-4" />
            {t("host.tours.create.buttons.addIncluded", "Add included item")}
          </button>
        </div>
        {errors.included && (
          <p className="mt-1 text-sm text-red-600">{errors.included}</p>
        )}
      </div>

      {/* Excluded */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          {t("host.tours.create.form.excluded", "What's Not Included")}
        </label>
        <div className="space-y-2">
          {formData.excluded.map((item, index) => (
            <div key={index} className="flex gap-2">
              <input
                type="text"
                value={item}
                onChange={(e) =>
                  updateArrayItem("excluded", index, e.target.value)
                }
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder={t(
                  "host.tours.create.placeholders.excluded",
                  "e.g., Meals"
                )}
              />
              {formData.excluded.length > 1 && (
                <button
                  type="button"
                  onClick={() => removeArrayItem("excluded", index)}
                  className="p-2 text-red-600 hover:bg-red-50 rounded-lg"
                >
                  <Minus className="w-4 h-4" />
                </button>
              )}
            </div>
          ))}
          <button
            type="button"
            onClick={() => addArrayItem("excluded")}
            className="flex items-center gap-2 px-4 py-2 text-blue-600 hover:bg-blue-50 rounded-lg"
          >
            <Plus className="w-4 h-4" />
            {t("host.tours.create.buttons.addExcluded", "Add excluded item")}
          </button>
        </div>
      </div>

      {/* Highlights */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          {t("host.tours.create.form.highlights", "Tour Highlights")}
        </label>
        <div className="space-y-2">
          {formData.highlights.map((item, index) => (
            <div key={index} className="flex gap-2">
              <input
                type="text"
                value={item}
                onChange={(e) =>
                  updateArrayItem("highlights", index, e.target.value)
                }
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder={t(
                  "host.tours.create.placeholders.highlights",
                  "e.g., Visit famous landmarks"
                )}
              />
              {formData.highlights.length > 1 && (
                <button
                  type="button"
                  onClick={() => removeArrayItem("highlights", index)}
                  className="p-2 text-red-600 hover:bg-red-50 rounded-lg"
                >
                  <Minus className="w-4 h-4" />
                </button>
              )}
            </div>
          ))}
          <button
            type="button"
            onClick={() => addArrayItem("highlights")}
            className="flex items-center gap-2 px-4 py-2 text-blue-600 hover:bg-blue-50 rounded-lg"
          >
            <Plus className="w-4 h-4" />
            {t("host.tours.create.buttons.addHighlight", "Add highlight")}
          </button>
        </div>
      </div>

      {/* Requirements */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          {t("host.tours.create.form.requirements", "Requirements")}
        </label>
        <div className="space-y-2">
          {formData.requirements.map((item, index) => (
            <div key={index} className="flex gap-2">
              <input
                type="text"
                value={item}
                onChange={(e) =>
                  updateArrayItem("requirements", index, e.target.value)
                }
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder={t(
                  "host.tours.create.placeholders.requirements",
                  "e.g., Comfortable walking shoes"
                )}
              />
              {formData.requirements.length > 1 && (
                <button
                  type="button"
                  onClick={() => removeArrayItem("requirements", index)}
                  className="p-2 text-red-600 hover:bg-red-50 rounded-lg"
                >
                  <Minus className="w-4 h-4" />
                </button>
              )}
            </div>
          ))}
          <button
            type="button"
            onClick={() => addArrayItem("requirements")}
            className="flex items-center gap-2 px-4 py-2 text-blue-600 hover:bg-blue-50 rounded-lg"
          >
            <Plus className="w-4 h-4" />
            {t("host.tours.create.buttons.addRequirement", "Add requirement")}
          </button>
        </div>
      </div>
    </div>
  );

  const renderStep4 = () => (
    <div className="space-y-6">
      <h2 className="text-2xl font-semibold text-gray-900 mb-6">
        {t("host.tours.create.steps.policies", "Policies & Review")}
      </h2>

      {/* Cancellation Policy */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          {t(
            "host.tours.create.form.cancellationPolicy",
            "Cancellation Policy"
          )}
        </label>
        <textarea
          value={formData.cancellationPolicy}
          onChange={(e) => updateFormData("cancellationPolicy", e.target.value)}
          rows={4}
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          placeholder={t(
            "host.tours.create.placeholders.cancellationPolicy",
            "Describe your cancellation and refund policy..."
          )}
        />
      </div>

      {/* Review Summary */}
      <div className="bg-gray-50 rounded-lg p-6">
        <h3 className="text-lg font-semibold mb-4">
          {t("host.tours.create.review.title", "Tour Summary")}
        </h3>
        <div className="space-y-3 text-sm">
          <div>
            <span className="font-medium">
              {t("host.tours.create.form.title", "Title")}:
            </span>{" "}
            {formData.title}
          </div>
          <div>
            <span className="font-medium">
              {t("host.tours.create.form.location", "Location")}:
            </span>{" "}
            {formData.location}
          </div>
          <div>
            <span className="font-medium">
              {t("host.tours.create.form.duration", "Duration")}:
            </span>{" "}
            {formData.duration}h
          </div>
          <div>
            <span className="font-medium">
              {t("host.tours.create.form.price", "Price")}:
            </span>{" "}
            €{formData.price}
          </div>
          <div>
            <span className="font-medium">
              {t("host.tours.create.form.maxParticipants", "Max Participants")}:
            </span>{" "}
            {formData.maxParticipants}
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="bg-white rounded-lg shadow-sm border">
      {/* Progress Steps */}
      <div className="border-b border-gray-200 p-6">
        <div className="flex items-center justify-between">
          {[1, 2, 3, 4].map((step) => (
            <div
              key={step}
              className={`flex items-center ${step < 4 ? "flex-1" : ""}`}
            >
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                  step <= currentStep
                    ? "bg-blue-600 text-white"
                    : "bg-gray-200 text-gray-600"
                }`}
              >
                {step}
              </div>
              {step < 4 && (
                <div
                  className={`flex-1 h-1 mx-4 ${
                    step < currentStep ? "bg-blue-600" : "bg-gray-200"
                  }`}
                />
              )}
            </div>
          ))}
        </div>
        <div className="flex justify-between mt-2 text-xs text-gray-600">
          <span>{t("host.tours.create.steps.basicInfo", "Basic Info")}</span>
          <span>{t("host.tours.create.steps.details", "Details")}</span>
          <span>{t("host.tours.create.steps.features", "Features")}</span>
          <span>{t("host.tours.create.steps.policies", "Policies")}</span>
        </div>
      </div>

      {/* Form Content */}
      <div className="p-6">
        {currentStep === 1 && renderStep1()}
        {currentStep === 2 && renderStep2()}
        {currentStep === 3 && renderStep3()}
        {currentStep === 4 && renderStep4()}
      </div>

      {/* Navigation */}
      <div className="border-t border-gray-200 p-6 flex justify-between">
        <button
          type="button"
          onClick={handlePrevious}
          disabled={currentStep === 1}
          className={`flex items-center gap-2 px-6 py-2 rounded-lg ${
            currentStep === 1
              ? "text-gray-400 cursor-not-allowed"
              : "text-gray-700 hover:bg-gray-50"
          }`}
        >
          <ChevronLeft className="w-4 h-4" />
          {t("common.previous", "Previous")}
        </button>

        <div className="flex gap-3">
          {currentStep === 4 && (
            <button
              type="button"
              className="flex items-center gap-2 px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
            >
              <Eye className="w-4 h-4" />
              {t("host.tours.create.buttons.preview", "Preview")}
            </button>
          )}

          {currentStep < 4 ? (
            <button
              type="button"
              onClick={handleNext}
              className="flex items-center gap-2 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              {t("common.next", "Next")}
            </button>
          ) : (
            <button
              type="button"
              onClick={handleSubmit}
              disabled={isLoading}
              className="flex items-center gap-2 px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  {t("host.tours.create.buttons.creating", "Creating...")}
                </>
              ) : (
                <>
                  <Save className="w-4 h-4" />
                  {t("host.tours.create.buttons.createTour", "Create Tour")}
                </>
              )}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
