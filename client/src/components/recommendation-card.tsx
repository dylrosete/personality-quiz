import { ReactNode } from "react";

interface RecommendationCardProps {
  title: string;
  icon: ReactNode;
  items: string[];
  testId: string;
}

export function RecommendationCard({ title, icon, items, testId }: RecommendationCardProps) {
  return (
    <div className="bg-card p-6 rounded-xl border border-border" data-testid={`recommendation-${testId}`}>
      <div className="flex items-center mb-4">
        {icon}
        <h4 className="text-xl font-semibold ml-3">{title}</h4>
      </div>
      <div className="space-y-3">
        {items.map((item, index) => (
          <div
            key={index}
            className="recommendation-item flex items-start space-x-3 p-3 bg-secondary/50 rounded-lg"
            style={{ animationDelay: `${index * 0.1}s` }}
            data-testid={`recommendation-item-${testId}-${index}`}
          >
            <span className="text-primary mt-1 flex-shrink-0">•</span>
            <span className="text-sm leading-relaxed">{item}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
