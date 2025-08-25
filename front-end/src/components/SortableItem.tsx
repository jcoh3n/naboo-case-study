import React from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { Box } from '@mantine/core';
import { IconGripVertical } from '@tabler/icons-react';
import { ActivityListItem } from '@/components/ActivityListItem';

interface SortableItemProps {
  id: string;
  activity: any;
  showFavoriteButton?: boolean;
}

export const SortableItem: React.FC<SortableItemProps> = ({ id, activity, showFavoriteButton = false }) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.8 : 1,
  };

  return (
    <Box
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      mb="sm"
      sx={{
        cursor: 'grab',
        '&:active': { cursor: 'grabbing' },
      }}
    >
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          gap: 'sm',
        }}
      >
        <IconGripVertical size={16} color="gray" />
        <ActivityListItem
          activity={activity}
          showFavoriteButton={showFavoriteButton}
          mb="0"
        />
      </Box>
    </Box>
  );
};
