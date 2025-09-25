interface CharacterCardProps {
  name: string;
  type: string;
  imageUrl: string;
}

export function CharacterCard({ name, type, imageUrl }: CharacterCardProps) {
  return (
    <div className="character-card bg-secondary p-4 rounded-lg text-center" data-testid={`character-card-${type.toLowerCase()}`}>
      <img 
        src={imageUrl} 
        alt={`${name} character representation`} 
        className="w-20 h-20 rounded-full mx-auto mb-3 object-cover"
        data-testid={`character-image-${type.toLowerCase()}`}
      />
      <div className="font-semibold" data-testid={`character-name-${type.toLowerCase()}`}>
        {name}
      </div>
      <div className="text-sm text-muted-foreground">{type} Character</div>
    </div>
  );
}
