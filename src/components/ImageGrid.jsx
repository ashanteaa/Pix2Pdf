import { memo } from "react";
import { DragDropContext, Draggable, Droppable } from "react-beautiful-dnd";

function ImageGrid({ images, onRemove, onReorder }) {
  const onDragEnd = (result) => {
    if (!result.destination) return;

    onReorder(result.source.index, result.destination.index);
  };

  return (
    <section className="panel">
      <h2> Image Queue</h2>
      <p className="helper">Drag cards to reorder pages before exporting.</p>
      <DragDropContext onDragEnd={onDragEnd}>
        <Droppable droppableId="images" direction="horizontal">
          {(provided) => (
            <div
              className="grid"
              ref={provided.innerRef}
              {...provided.droppableProps}
            >
              {images.map((image, index) => (
                <Draggable key={image.id} draggableId={image.id} index={index}>
                  {(draggableProvided, snapshot) => (
                    <article
                      className={`image-card ${snapshot.isDragging ? "dragging" : ""}`}
                      ref={draggableProvided.innerRef}
                      {...draggableProvided.draggableProps}
                      {...draggableProvided.dragHandleProps}
                    >
                      <button
                        className="remove-btn"
                        onClick={() => onRemove(image.id)}
                        aria-label="Remove image"
                      >
                        ✕
                      </button>

                      <img
                        src={image.preview}
                        alt={image.name}
                        loading="lazy"
                      />

                      <div className="card-meta">
                        <span>
                          {index + 1}. {image.name}
                        </span>
                      </div>
                    </article>
                  )}
                </Draggable>
              ))}
              {provided.placeholder}
            </div>
          )}
        </Droppable>
      </DragDropContext>
    </section>
  );
}

export default memo(ImageGrid);