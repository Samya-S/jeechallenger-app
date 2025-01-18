const CategorySection = ({ category, backgroundColor, items }) => {
  return (
    <div className="px-5 py-10" style={{ backgroundColor }}>
      <p className="heading text-4xl !font-[500]">{category}</p>
      <div className="flex-container" style={{ flexWrap: 'wrap' }}>
        {items.map((item, index) => (
          <div key={index}>
            <p className="subheading text-2xl">{item.title}</p>
            <a href={item.link} target="_blank" rel="noreferrer">
              <button className="button1">Download</button>
            </a>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CategorySection;
