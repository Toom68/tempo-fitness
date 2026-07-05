"use client";

import { useState, useMemo } from "react";
import { Search, Dumbbell, Filter, X } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import type { Exercise, MuscleGroup, Equipment } from "@/types";

const MUSCLE_GROUPS: { value: MuscleGroup; label: string }[] = [
  { value: "chest", label: "Chest" },
  { value: "back", label: "Back" },
  { value: "shoulders", label: "Shoulders" },
  { value: "biceps", label: "Biceps" },
  { value: "triceps", label: "Triceps" },
  { value: "forearms", label: "Forearms" },
  { value: "abs", label: "Core" },
  { value: "quads", label: "Quads" },
  { value: "hamstrings", label: "Hamstrings" },
  { value: "glutes", label: "Glutes" },
  { value: "calves", label: "Calves" },
  { value: "traps", label: "Traps" },
  { value: "full_body", label: "Full Body" },
];

const EQUIPMENT_TYPES: { value: Equipment; label: string }[] = [
  { value: "barbell", label: "Barbell" },
  { value: "dumbbell", label: "Dumbbell" },
  { value: "machine", label: "Machine" },
  { value: "cable", label: "Cable" },
  { value: "kettlebell", label: "Kettlebell" },
  { value: "bodyweight", label: "Bodyweight" },
  { value: "bands", label: "Bands" },
  { value: "plate", label: "Plates" },
  { value: "other", label: "Other" },
];

const COMPOUND_MUSCLES: MuscleGroup[] = ["chest", "back", "shoulders", "quads", "hamstrings", "glutes"];
const ISOLATION_MUSCLES: MuscleGroup[] = ["biceps", "triceps", "forearms", "abs", "calves", "traps"];

export function ExercisePicker({
  exercises,
  onSelect,
}: {
  exercises: Exercise[] | undefined;
  onSelect: (exercise: Exercise) => void;
}) {
  const [search, setSearch] = useState("");
  const [showFilters, setShowFilters] = useState(false);
  const [activeMuscle, setActiveMuscle] = useState<MuscleGroup | null>(null);
  const [activeEquipment, setActiveEquipment] = useState<Equipment | null>(null);
  const [effectiveness, setEffectiveness] = useState<"all" | "compound" | "isolation">("all");

  const filtered = useMemo(() => {
    if (!exercises) return [];
    return exercises.filter((ex) => {
      if (search && !ex.name.toLowerCase().includes(search.toLowerCase())) return false;
      if (activeMuscle && ex.muscle_group !== activeMuscle && !ex.secondary_muscles?.includes(activeMuscle)) return false;
      if (activeEquipment && ex.equipment !== activeEquipment) return false;
      if (effectiveness === "compound" && !COMPOUND_MUSCLES.includes(ex.muscle_group)) return false;
      if (effectiveness === "isolation" && !ISOLATION_MUSCLES.includes(ex.muscle_group)) return false;
      return true;
    });
  }, [exercises, search, activeMuscle, activeEquipment, effectiveness]);

  const activeFilterCount =
    (activeMuscle ? 1 : 0) + (activeEquipment ? 1 : 0) + (effectiveness !== "all" ? 1 : 0);

  function clearFilters() {
    setActiveMuscle(null);
    setActiveEquipment(null);
    setEffectiveness("all");
  }

  return (
    <Card>
      <CardHeader className="space-y-3">
        <div className="flex items-center gap-2">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              autoFocus
              placeholder="Search exercises..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-10"
            />
          </div>
          <Button
            variant={showFilters ? "default" : "outline"}
            size="icon"
            onClick={() => setShowFilters(!showFilters)}
            className="relative"
          >
            <Filter className="h-4 w-4" />
            {activeFilterCount > 0 && (
              <span className="absolute -right-1 -top-1 flex h-4 w-4 items-center justify-center rounded-full bg-destructive text-[10px] text-destructive-foreground">
                {activeFilterCount}
              </span>
            )}
          </Button>
        </div>

        {showFilters && (
          <div className="space-y-3 rounded-lg border p-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium text-muted-foreground">Filters</span>
              {activeFilterCount > 0 && (
                <button onClick={clearFilters} className="flex items-center gap-1 text-xs text-destructive hover:underline">
                  <X className="h-3 w-3" /> Clear all
                </button>
              )}
            </div>

            <div className="space-y-1.5">
              <span className="text-xs font-medium">Muscle Group</span>
              <div className="flex flex-wrap gap-1.5">
                {MUSCLE_GROUPS.map((mg) => (
                  <button
                    key={mg.value}
                    onClick={() => setActiveMuscle(activeMuscle === mg.value ? null : mg.value)}
                    className={`rounded-md px-2.5 py-1 text-xs font-medium transition-colors ${
                      activeMuscle === mg.value
                        ? "bg-primary text-primary-foreground"
                        : "bg-secondary text-secondary-foreground hover:bg-secondary/80"
                    }`}
                  >
                    {mg.label}
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-1.5">
              <span className="text-xs font-medium">Equipment</span>
              <div className="flex flex-wrap gap-1.5">
                {EQUIPMENT_TYPES.map((eq) => (
                  <button
                    key={eq.value}
                    onClick={() => setActiveEquipment(activeEquipment === eq.value ? null : eq.value)}
                    className={`rounded-md px-2.5 py-1 text-xs font-medium transition-colors ${
                      activeEquipment === eq.value
                        ? "bg-primary text-primary-foreground"
                        : "bg-secondary text-secondary-foreground hover:bg-secondary/80"
                    }`}
                  >
                    {eq.label}
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-1.5">
              <span className="text-xs font-medium">Effectiveness</span>
              <div className="flex gap-1.5">
                {[
                  { value: "all" as const, label: "All" },
                  { value: "compound" as const, label: "Compound" },
                  { value: "isolation" as const, label: "Isolation" },
                ].map((eff) => (
                  <button
                    key={eff.value}
                    onClick={() => setEffectiveness(eff.value)}
                    className={`rounded-md px-2.5 py-1 text-xs font-medium transition-colors ${
                      effectiveness === eff.value
                        ? "bg-primary text-primary-foreground"
                        : "bg-secondary text-secondary-foreground hover:bg-secondary/80"
                    }`}
                  >
                    {eff.label}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}
      </CardHeader>
      <CardContent className="max-h-64 overflow-y-auto">
        {filtered.length > 0 ? (
          <div className="space-y-1">
            {filtered.map((ex) => (
              <button
                key={ex.id}
                onClick={() => onSelect(ex)}
                className="flex w-full items-center gap-3 rounded-md p-2 text-left hover:bg-accent"
              >
                <Dumbbell className="h-4 w-4 shrink-0 text-muted-foreground" />
                <div className="min-w-0 flex-1">
                  <span className="text-sm">{ex.name}</span>
                  <div className="flex gap-1.5 text-[10px] text-muted-foreground">
                    <span className="capitalize">{ex.muscle_group.replace("_", " ")}</span>
                    <span>·</span>
                    <span className="capitalize">{ex.equipment}</span>
                  </div>
                </div>
              </button>
            ))}
          </div>
        ) : (
          <p className="py-4 text-center text-sm text-muted-foreground">No exercises found</p>
        )}
        {filtered.length > 0 && (
          <p className="pt-2 text-center text-xs text-muted-foreground">{filtered.length} exercise{filtered.length !== 1 ? "s" : ""}</p>
        )}
      </CardContent>
    </Card>
  );
}
