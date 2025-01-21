const CategorySection = ({ category, backgroundColor, items }) => {
  return (
    <div className="px-5 py-10" style={{ backgroundColor }}>
      <p className="heading text-4xl !font-[500]">{category}</p>
      <div className="flex-container" style={{ flexWrap: 'wrap' }}>
        {items.map((item, index) => (
          <div key={index}>
            <p className="subheading text-2xl">{item.title}</p>
            {item.subtitle && <p className="text-lg -mt-2 pb-4">{item.subtitle}</p>}
            <a
              href={item.link || item.links[0]}
              target="_blank"
              rel="noreferrer"
            >
              <button className="button1">Download</button>
            </a>
            {item.links && (
              <div>
                {/* start this loop from second index */}
                {item.links.slice(1).map((link, linkIndex) => (
                  <span key={`${index}-${linkIndex}`}>
                    <a
                      href={link}
                      target="_blank"
                      rel="noreferrer"
                      style={{ color: "red", textDecoration: "underline" }}
                    >
                      Link {linkIndex + 2}
                    </a>
                    {linkIndex !== item.links.length - 2 && ", "}
                  </span>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default CategorySection;
